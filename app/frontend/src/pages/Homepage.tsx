import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Brain,
  BarChartIcon as ChartBar,
  Clock,
  Shield,
  SmileIcon as Tooth,
  UserIcon,
  Zap,
} from "lucide-react";

const HomePage = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="px-4 lg:px-6 h-14 flex items-center">
        <a className="flex items-center justify-center" href="#">
          <Tooth className="h-6 w-6" />
          <span className="sr-only">DentalAI</span>
        </a>
        <nav className="flex-1 flex justify-center gap-6 text-lg">
          <a
            className="text-sm font-medium hover:underline underline-offset-4"
            href="#features"
          >
            Features
          </a>
          <a
            className="text-sm font-medium hover:underline underline-offset-4"
            href="#how-it-works"
          >
            How It Works
          </a>
          <a
            className="text-sm font-medium hover:underline underline-offset-4"
            href="#benefits"
          >
            Benefits
          </a>
          <a
            className="text-sm font-large hover:underline underline-offset-4"
            href="#contact"
          >
            Contact
          </a>
        </nav>
        <Button variant="ghost" className="ml-auto flex items-center gap-2">
          <UserIcon className="h-5 w-5" />
          Sign In
        </Button>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
              <div className="max-w-full">
                <div className="border border-gray-200 shadow-lg rounded-lg overflow-hidden transform transition-transform hover:scale-105">
                  <img
                    src="https://media.istockphoto.com/id/171294275/photo/panoramic-dental-x-ray.jpg?s=612x612&w=0&k=20&c=cKxtL1W0L2LKVoZnNfiUj8umm6kQDonINuhn8NdCda4="
                    alt="Dental X-ray with AI analysis"
                    className="w-full h-auto object-cover"
                  />
                </div>
              </div>
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                    Revolutionary Dental AI Analysis
                  </h1>
                  <p className="max-w-[600px] text-gray-500 md:text-xl dark:text-gray-400">
                    Harness the power of AI to analyze X-rays and provide
                    comprehensive implant recommendations with unparalleled
                    accuracy.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Button size="lg">Get Started</Button>
                  <Button size="lg" variant="outline">
                    Learn More
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section
          id="features"
          className="w-full py-12 md:py-24 lg:py-32 bg-gray-100 dark:bg-gray-800"
        >
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-12">
              Key Features
            </h2>
            <div className="grid gap-6 lg:grid-cols-3">
              <Card>
                <CardHeader>
                  <Brain className="w-12 h-12 mb-4" />
                  <CardTitle>AI-Powered Analysis</CardTitle>
                </CardHeader>
                <CardContent>
                  Advanced machine learning algorithms analyze X-rays with high
                  precision, identifying potential implant sites.
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <Zap className="w-12 h-12 mb-4" />
                  <CardTitle>Instant Results</CardTitle>
                </CardHeader>
                <CardContent>
                  Receive comprehensive analysis and implant recommendations
                  within seconds of uploading X-rays.
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <ChartBar className="w-12 h-12 mb-4" />
                  <CardTitle>Detailed Reporting</CardTitle>
                </CardHeader>
                <CardContent>
                  Generate in-depth reports with visualizations to support
                  treatment planning and patient communication.
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
        <section id="how-it-works" className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-12">
              How It Works
            </h2>
            <div className="grid gap-6 lg:grid-cols-3">
              <div className="flex flex-col items-center text-center">
                <div className="mb-4 rounded-full bg-primary p-3">
                  <Clock className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-2">1. Upload X-rays</h3>
                <p className="text-gray-500 dark:text-gray-400">
                  Securely upload patient X-rays to our HIPAA-compliant
                  platform.
                </p>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="mb-4 rounded-full bg-primary p-3">
                  <Brain className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-2">2. AI Analysis</h3>
                <p className="text-gray-500 dark:text-gray-400">
                  Our AI algorithms analyze the X-rays and identify optimal
                  implant locations.
                </p>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="mb-4 rounded-full bg-primary p-3">
                  <ChartBar className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-2">3. Review Results</h3>
                <p className="text-gray-500 dark:text-gray-400">
                  Receive a detailed report with implant recommendations and
                  treatment insights.
                </p>
              </div>
            </div>
          </div>
        </section>
        <section
          id="benefits"
          className="w-full py-12 md:py-24 lg:py-32 bg-gray-100 dark:bg-gray-800"
        >
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-12">
              Benefits
            </h2>
            <div className="grid gap-6 lg:grid-cols-2">
              <Card>
                <CardHeader>
                  <Clock className="w-8 h-8 mb-4" />
                  <CardTitle>Save Time</CardTitle>
                </CardHeader>
                <CardContent>
                  Reduce analysis time from hours to minutes, allowing you to
                  see more patients and improve practice efficiency.
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <Shield className="w-8 h-8 mb-4" />
                  <CardTitle>Improve Accuracy</CardTitle>
                </CardHeader>
                <CardContent>
                  Benefit from AI-driven insights that complement your expertise
                  and enhance diagnostic accuracy.
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <ChartBar className="w-8 h-8 mb-4" />
                  <CardTitle>Enhance Patient Care</CardTitle>
                </CardHeader>
                <CardContent>
                  Provide patients with clear, visual explanations of their
                  treatment needs, improving understanding and acceptance.
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <Zap className="w-8 h-8 mb-4" />
                  <CardTitle>Stay Competitive</CardTitle>
                </CardHeader>
                <CardContent>
                  Leverage cutting-edge technology to differentiate your
                  practice and attract tech-savvy patients.
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
        <section id="contact" className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                  Ready to Transform Your Practice?
                </h2>
                <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                  Join the dental AI revolution and elevate your implant
                  planning process. Contact us for a demo or to learn more.
                </p>
              </div>
              <div className="w-full max-w-sm space-y-2">
                <Button className="w-full" size="lg">
                  Request a Demo
                </Button>
                <Button className="w-full" variant="outline" size="lg">
                  Contact Sales
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-gray-500 dark:text-gray-400">
          © 2024 DentalAI. All rights reserved.
        </p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <a className="text-xs hover:underline underline-offset-4" href="#">
            Terms of Service
          </a>
          <a className="text-xs hover:underline underline-offset-4" href="#">
            Privacy
          </a>
        </nav>
      </footer>
    </div>
  );
};
export default HomePage;
