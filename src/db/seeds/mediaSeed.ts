import { faker } from '@faker-js/faker';
import { db } from '../index';
import { mediaTable, authorsTable, tagsTable, categoriesTable, mediaTagsTable, mediaCategoriesTable } from '../schema/mediaSchema';
import { platformsTable } from '../schema/platformsSchema';

const MEDIA_COUNT = 50;
const AUTHOR_COUNT = 10;
const TAG_COUNT = 20;
const CATEGORY_COUNT = 10;

export async function seed() {
    // Seed platforms (assuming you have a platforms table)
    const platformIds = await db.insert(platformsTable)
        .values([
            { name: 'YouTube' },
            { name: 'Vimeo' },
            { name: 'SoundCloud' },
        ])
        .returning({ id: platformsTable.id });

    // Seed authors
    const authorIds = await db.insert(authorsTable)
        .values(
            Array.from({ length: AUTHOR_COUNT }, () => ({
                name: faker.person.fullName(),
                bio: faker.lorem.paragraph(),
                platformId: faker.helpers.arrayElement(platformIds).id,
            }))
        )
        .returning({ id: authorsTable.id });

    // Seed tags
    const uniqueTagNames = new Set<string>();
    // ensure unique tag names
    const tagIds = await db.insert(tagsTable)
        .values(
            Array.from({ length: TAG_COUNT }, () => {
                let tagName: string;
                do {
                    tagName = faker.word.noun();
                } while (uniqueTagNames.has(tagName));
                uniqueTagNames.add(tagName);
                return { name: tagName };
            })
        )
        .returning({ id: tagsTable.id });

    // Seed categories
    const uniqueCategoryNames = new Set<string>();
    // ensure unique category names
    const categoryIds = await db.insert(categoriesTable)
        .values(
            Array.from({ length: CATEGORY_COUNT }, () => {
                let categoryName: string;
                do {
                    categoryName = faker.commerce.department();
                } while (uniqueCategoryNames.has(categoryName));
                uniqueCategoryNames.add(categoryName);
                return { name: categoryName, description: faker.lorem.sentence() };
            })
        )
        .returning({ id: categoriesTable.id });

    // Seed media
    for (let i = 0; i < MEDIA_COUNT; i++) {
        const mediaType = faker.helpers.arrayElement(['image', 'video', 'audio', 'file']);
        const mediaId = await db.insert(mediaTable)
            .values({
                title: faker.lorem.sentence(),
                content: { description: faker.lorem.paragraph() },
                url: faker.internet.url(),
                thumbnailUrl: faker.image.urlPicsumPhotos(),
                type: mediaType,
                duration: mediaType === 'video' || mediaType === 'audio' ? faker.number.int({ min: 30, max: 3600 }) : null,
                publishedAt: faker.date.past(),
                authorId: faker.helpers.arrayElement(authorIds).id,
                platformId: faker.helpers.arrayElement(platformIds).id,
                metadata: { views: faker.number.int({ min: 100, max: 1000000 }) },
            })
            .returning({ id: mediaTable.id });

        // Add tags to media
        const mediaTagCount = faker.number.int({ min: 1, max: 5 });
        await db.insert(mediaTagsTable)
            .values(
                faker.helpers.arrayElements(tagIds, mediaTagCount).map(tag => ({
                    mediaId: mediaId[0].id,
                    tagId: tag.id,
                }))
            );

        // Add categories to media
        const mediaCategoryCount = faker.number.int({ min: 1, max: 3 });
        await db.insert(mediaCategoriesTable)
            .values(
                faker.helpers.arrayElements(categoryIds, mediaCategoryCount).map(category => ({
                    mediaId: mediaId[0].id,
                    categoryId: category.id,
                }))
            );
    }

    console.log('Media seed completed successfully');
}

