# Social Media Management App

This repository contains the source code for a cutting-edge social media management application. Designed to streamline the process of creating, editing, and publishing videos across multiple platforms, the app empowers users to enhance their social media presence effortlessly. By aggregating data from various sources, including web scraping, API integrations, and user-generated content, the app provides comprehensive insights into social media performance.

The application allows users to reach a wider audience by publishing videos in different sizes and formats suitable for various platforms such as YouTube and TikTok. Additionally, users can access advanced analytics to understand their content's impact, helping them make data-driven decisions to improve engagement and reach. The app simplifies content management, saving users time and effort, while also ensuring an easy and efficient way to handle multiple social media channels from a single interface.

## Key Features
- Video Creation and Editing: Create and edit videos directly within the app.
- Multi-Platform Publishing: Publish videos on YouTube, TikTok, and other social media platforms in various formats and sizes.
- Performance Analytics: Access insights into your social media performance through comprehensive data analysis.
- Content Aggregation: Curate and manage content from diverse sources, incorporating web scraping for machine learning datasets and user-generated contributions, ensuring comprehensive and structured data collection.

## Challenges
- Copyright Compliance: Avoid infringing on copyrighted content while collecting and republishing data.
- Spam Prevention: Implement measures to prevent spam and maintain content quality.
- User Privacy: Ensure secure data collection and storage to protect user privacy.
- Data Collection Complexity: Efficiently gather data from diverse sources.
- Advanced Data Analysis: Analyze collected data effectively to provide valuable insights.

## Technologies Used
- Next.js: Framework for building server-rendered React applications.
- Drizzle ORM: Object-relational mapping library for interacting with the database.
- TypeScript: Typed superset of JavaScript for building scalable and maintainable code.
- Postgres: Relational database for storing app data.
- Tailwind CSS & [shadcn](https://ui.shadcn.com)
- Pnpm: Package manager for installing dependencies.
- API Integration: Connects with various social media platforms via their APIs.

## Getting Started
To get started with the project, clone the repository and follow the instructions below:


1. Clone the repository
2. Copy the `.env.example` file and rename it to `.env.local`. Update the environment variables with your own values.
3. Install the dependencies:
```
pnpm install
```
4. Generate the Prisma client:
```
pnpm db:generate
```
5. Migrate the database:
```
pnpm db:push
```
6. Seed the database:
```
pnpm db:seed
```

7. Start the development server:
```
pnpm dev
```
The application should now be running on `http://localhost:3000`.

<!-- 8. Sign in with the following credentials:

- Email: `admin@admin.com` or `user@user.com`
- Password: `12345678` -->


<!-- ## Resources
- [How to Create a Form](./docs/how-to-create-form.md)
- [Database Schema](./docs/database-schema.md) -->
