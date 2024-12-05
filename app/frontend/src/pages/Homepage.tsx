import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Brain,
  BarChartIcon as ChartBar,
  Clock,
  Shield,
  StethoscopeIcon,
  UserIcon,
  Zap,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const navigate = useNavigate();

  const handleSignInClick = () => {
    navigate("/signin");
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800">
      <header className="px-4 lg:px-6 h-14 flex items-center bg-white dark:bg-gray-800 shadow-sm">
        <a className="flex items-center justify-center" href="#">
          <StethoscopeIcon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
          <span className="ml-2 text-xl font-semibold text-gray-800 dark:text-white">Ortho Vision</span>
        </a>
        <nav className="flex-1 flex justify-center gap-6 text-lg">
          <a
            className="text-sm font-medium hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            href="#features"
          >
            Features
          </a>
          <a
            className="text-sm font-medium hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            href="#how-it-works"
          >
            How It Works
          </a>
          <a
            className="text-sm font-medium hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            href="#benefits"
          >
            Benefits
          </a>
          <a
            className="text-sm font-medium hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            href="#contact"
          >
            Contact
          </a>
        </nav>
        <Button variant="outline" className="ml-auto flex items-center gap-2 text-blue-600 border-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:border-blue-400 dark:hover:bg-gray-700"
        onClick={handleSignInClick}>
          <UserIcon className="h-5 w-5" />
          Sign In
        </Button>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-gradient-to-br from-blue-100 via-white to-blue-50 dark:from-gray-800 dark:via-gray-900 dark:to-gray-800">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_600px] lg:gap-12 xl:grid-cols-[1fr_800px]">
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
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-cyan-600 dark:from-blue-400 dark:to-cyan-400">
                    Revolutionary Dental AI Analysis
                  </h1>
                  <p className="max-w-[600px] text-gray-600 md:text-xl dark:text-gray-300">
                    Harness the power of AI to analyze X-rays and provide
                    comprehensive implant recommendations with unparalleled
                    accuracy.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white">Get Started</Button>
                  <Button size="lg" variant="outline" className="text-blue-600 border-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:border-blue-400 dark:hover:bg-gray-700">
                    Learn More
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section
          id="features"
          className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-white to-blue-50 dark:from-gray-800 dark:to-gray-900"
        >
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-12 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-cyan-600 dark:from-blue-400 dark:to-cyan-400">
              Key Features
            </h2>
            <div className="grid gap-6 lg:grid-cols-3">
              <Card className="bg-white/50 backdrop-blur-sm dark:bg-gray-800/50 hover:shadow-lg transition-shadow">
                <CardHeader>
                  <Brain className="w-12 h-12 mb-4 text-blue-600 dark:text-blue-400" />
                  <CardTitle className="text-blue-600 dark:text-blue-400">AI-Powered Analysis</CardTitle>
                </CardHeader>
                <CardContent>
                  Advanced machine learning algorithms analyze X-rays with high
                  precision, identifying potential implant sites.
                </CardContent>
              </Card>
              <Card className="bg-white/50 backdrop-blur-sm dark:bg-gray-800/50 hover:shadow-lg transition-shadow">
                <CardHeader>
                  <Zap className="w-12 h-12 mb-4 text-blue-600 dark:text-blue-400" />
                  <CardTitle className="text-blue-600 dark:text-blue-400">Instant Results</CardTitle>
                </CardHeader>
                <CardContent>
                  Receive comprehensive analysis and implant recommendations
                  within seconds of uploading X-rays.
                </CardContent>
              </Card>
              <Card className="bg-white/50 backdrop-blur-sm dark:bg-gray-800/50 hover:shadow-lg transition-shadow">
                <CardHeader>
                  <ChartBar className="w-12 h-12 mb-4 text-blue-600 dark:text-blue-400" />
                  <CardTitle className="text-blue-600 dark:text-blue-400">Detailed Reporting</CardTitle>
                </CardHeader>
                <CardContent>
                  Generate in-depth reports with visualizations to support
                  treatment planning and patient communication.
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
        <section id="how-it-works" className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-12 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-cyan-600 dark:from-blue-400 dark:to-cyan-400">
              How It Works
            </h2>
            <div className="grid gap-6 lg:grid-cols-3">
              <div className="flex flex-col items-center text-center">
                <div className="mb-4 rounded-full bg-gradient-to-r from-blue-600 to-cyan-600 p-3">
                  <Clock className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-2 text-blue-600 dark:text-blue-400">1. Upload X-rays</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Securely upload patient X-rays to our HIPAA-compliant
                  platform.
                </p>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="mb-4 rounded-full bg-gradient-to-r from-blue-600 to-cyan-600 p-3">
                  <Brain className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-2 text-blue-600 dark:text-blue-400">2. AI Analysis</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Our AI algorithms analyze the X-rays and identify optimal
                  implant locations.
                </p>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="mb-4 rounded-full bg-gradient-to-r from-blue-600 to-cyan-600 p-3">
                  <ChartBar className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-2 text-blue-600 dark:text-blue-400">3. Review Results</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Receive a detailed report with implant recommendations and
                  treatment insights.
                </p>
              </div>
            </div>
          </div>
        </section>
        <section
          id="benefits"
          className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-white to-blue-50 dark:from-gray-800 dark:to-gray-900"
        >
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-12 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-cyan-600 dark:from-blue-400 dark:to-cyan-400">
              Benefits
            </h2>
            <div className="grid gap-6 lg:grid-cols-2">
              <Card className="bg-white/50 backdrop-blur-sm dark:bg-gray-800/50 hover:shadow-lg transition-shadow">
                <CardHeader>
                  <Clock className="w-8 h-8 mb-4 text-blue-600 dark:text-blue-400" />
                  <CardTitle className="text-blue-600 dark:text-blue-400">Save Time</CardTitle>
                </CardHeader>
                <CardContent>
                  Reduce analysis time from hours to minutes, allowing you to
                  see more patients and improve practice efficiency.
                </CardContent>
              </Card>
              <Card className="bg-white/50 backdrop-blur-sm dark:bg-gray-800/50 hover:shadow-lg transition-shadow">
                <CardHeader>
                  <Shield className="w-8 h-8 mb-4 text-blue-600 dark:text-blue-400" />
                  <CardTitle className="text-blue-600 dark:text-blue-400">Improve Accuracy</CardTitle>
                </CardHeader>
                <CardContent>
                  Benefit from AI-driven insights that complement your expertise
                  and enhance diagnostic accuracy.
                </CardContent>
              </Card>
              <Card className="bg-white/50 backdrop-blur-sm dark:bg-gray-800/50 hover:shadow-lg transition-shadow">
                <CardHeader>
                  <ChartBar className="w-8 h-8 mb-4 text-blue-600 dark:text-blue-400" />
                  <CardTitle className="text-blue-600 dark:text-blue-400">Enhance Patient Care</CardTitle>
                </CardHeader>
                <CardContent>
                  Provide patients with clear, visual explanations of their
                  treatment needs, improving understanding and acceptance.
                </CardContent>
              </Card>
              <Card className="bg-white/50 backdrop-blur-sm dark:bg-gray-800/50 hover:shadow-lg transition-shadow">
                <CardHeader>
                  <Zap className="w-8 h-8 mb-4 text-blue-600 dark:text-blue-400" />
                  <CardTitle className="text-blue-600 dark:text-blue-400">Stay Competitive</CardTitle>
                </CardHeader>
                <CardContent>
                  Leverage cutting-edge technology to differentiate your
                  practice and attract tech-savvy patients.
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
        <section id="contact" className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-cyan-600 dark:from-blue-400 dark:to-cyan-400">
                  Ready to Transform Your Practice?
                </h2>
                <p className="max-w-[900px] text-gray-600 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-300">
                  Join the dental AI revolution and elevate your implant
                  planning process. Contact us for a demo or to learn more.
                </p>
              </div>
              <div className="w-full max-w-sm space-y-2">
                <Button className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white" size="lg">
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
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t bg-gradient-to-b from-white to-blue-50 dark:from-gray-800 dark:to-gray-900">
        <p className="text-xs text-gray-600 dark:text-gray-400">
          © 2024 Ortho Vision. All rights reserved.
        </p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <a className="text-xs hover:underline underline-offset-4 text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400" href="#">
            Terms of Service
          </a>
          <a className="text-xs hover:underline underline-offset-4 text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400" href="#">
            Privacy
          </a>
        </nav>
      </footer>
    </div>
  )
}

export default HomePage;
