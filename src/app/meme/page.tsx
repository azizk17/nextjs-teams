import Image from 'next/image'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Sparkles } from 'lucide-react'

export default function MemeCoinLandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-yellow-100 to-orange-200">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-12 relative">
          <Image src="/doge-logo.png" alt="DogeCoin 2.0 Logo" width={150} height={150} className="mx-auto mb-4" />
          <h1 className="text-6xl font-bold mb-2 text-orange-600">🐶 DogeCoin 2.0 🚀</h1>
          <p className="text-2xl text-orange-800">The goodest boy in crypto!</p>
          <Badge variant="secondary" className="absolute top-0 right-0 animate-bounce">
            <Sparkles className="mr-1" /> New
          </Badge>
        </header>

        <main>
          <section className="mb-16">
            <Card className="w-full max-w-3xl mx-auto shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader className="bg-orange-500 text-white">
                <CardTitle className="text-3xl">Why Choose DogeCoin 2.0?</CardTitle>
              </CardHeader>
              <CardContent className="bg-white">
                <ul className="list-none pl-6 space-y-4">
                  {[ 
                    { icon: '🚀', text: 'Much wow, very crypto' },
                    { icon: '❤️', text: 'Backed by the power of puppy love' },
                    { icon: '🌐', text: 'Community-driven and meme-powered' },
                    { icon: '🦴', text: '1 DogeCoin 2.0 = 1 Treat (always)' }
                  ].map(({ icon, text }) => (
                    <li key={text} className="flex items-center text-lg">
                      <span className="text-2xl mr-2">{icon}</span> {text}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </section>

          <section className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6 text-orange-700">Join the Pack!</h2>
            <Button size="lg" className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-6 text-xl rounded-full animate-pulse">
              Buy DogeCoin 2.0
            </Button>
          </section>

          <section className="grid md:grid-cols-3 gap-8 mb-16">
            {[ 
              { title: 'Much Security', icon: '🔒' },
              { title: 'Very Fast', icon: '⚡' },
              { title: 'So Decentralized', icon: '🌍' }
            ].map(({ title, icon }) => (
              <Card key={title} className="overflow-hidden transform hover:scale-105 transition-transform duration-300">
                <CardHeader className="bg-gradient-to-r from-orange-400 to-red-500 text-white">
                  <CardTitle className="flex items-center justify-center text-2xl">
                    <span className="text-3xl mr-2">{icon}</span> {title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-center">Wow, such amazing feature. Many benefits. Very impress.</p>
                </CardContent>
              </Card>
            ))}
          </section>

          <section className="text-center bg-orange-100 py-12 rounded-lg shadow-inner">
            <h2 className="text-4xl font-bold mb-6 text-orange-800">Ready to fetch some gains?</h2>
            <Button variant="outline" size="lg" className="border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white">
              Learn More
            </Button>
          </section>
        </main>

        <footer className="mt-16 text-center text-orange-700">
          <p className="text-lg">© 2023 DogeCoin 2.0. All rights woof-served. 🐾</p>
          <div className="mt-4 flex justify-center space-x-4">
            {['Twitter', 'Discord', 'Telegram'].map((social) => (
              <Button key={social} variant="ghost" className="text-orange-600 hover:text-orange-800">
                {social}
              </Button>
            ))}
          </div>
        </footer>
      </div>
    </div>
  )
}
