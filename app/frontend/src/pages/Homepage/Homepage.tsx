import { Button } from "@/components/Button/Button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/Card/Card";
import Footer from "@/components/Footer/Footer";
import HomePageNavbar from "@/components/Navbar/HomePageNavBar";
import {
  Brain,
  BarChartIcon as ChartBar,
  Clock,
  Shield,
  Zap,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import "./Homepage.css";
const HomePage = () => {
  const navigate = useNavigate();

  // Handle Sign In click
  const handleSignInClick = () => {
    navigate("/signin"); // Redirect to the SignIn page
  };

  // Handle Log Out
  const handleLogout = () => {
    localStorage.removeItem("jwtToken");
    localStorage.removeItem("user_id");
    localStorage.removeItem("role");
    localStorage.removeItem("patient_id");
    localStorage.removeItem("chatMessages");
    navigate("/");
  };


  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800">
      <HomePageNavbar
        handleSignInClick={handleSignInClick}
        handleLogout={handleLogout}
      />
      <main className="flex-1 ">
        <section className="w-full justify-center py-12 md:py-24 lg:py-32 xl:py-48 bg-gradient-to-br from-blue-100 via-white to-blue-50 dark:from-gray-800 dark:via-gray-900 dark:to-gray-800">
          <div className="container mx-auto px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_600px] lg:gap-12 xl:grid-cols-[1fr_800px]">
              <div className="max-w-full">
                <div className="border  border-gray-200 shadow-lg rounded-lg overflow-hidden transform transition-transform hover:scale-105">
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
                    Advanced Dental Anomaly Detection and AI Chatbot Assistance
                  </h1>
                  <p className="max-w-[600px] text-gray-600 md:text-xl dark:text-gray-300">
                    Utilize cutting-edge AI technology to detect dental anomalies in X-rays and receive instant assistance from our intelligent chatbot for treatment planning and patient communication.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Button
                    size="lg"
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                    onClick={() => navigate("/signin")}
                  >
                    Get Started
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="text-blue-600 border-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:border-blue-400 dark:hover:bg-gray-700"
                    onClick={() => navigate("/about")}
                  >
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
          <div className="container mx-auto px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-12 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-cyan-600 dark:from-blue-400 dark:to-cyan-400">
              Key Features
            </h2>
            <div className="grid gap-6 lg:grid-cols-3">
              <Card className="bg-white/50 backdrop-blur-sm dark:bg-gray-800/50 hover:shadow-lg transition-shadow">
                <CardHeader>
                  <Brain className="w-12 h-12 mb-4 text-blue-600 dark:text-blue-400" />
                  <CardTitle className="text-blue-600 dark:text-blue-400">
                    AI-Powered Anomaly Detection
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  Leverage advanced AI models to identify dental anomalies in X-rays with high precision.
                </CardContent>
              </Card>
              <Card className="bg-white/50 backdrop-blur-sm dark:bg-gray-800/50 hover:shadow-lg transition-shadow">
                <CardHeader>
                  <Zap className="w-12 h-12 mb-4 text-blue-600 dark:text-blue-400" />
                  <CardTitle className="text-blue-600 dark:text-blue-400">
                    Intelligent Chatbot Assistance
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  Get instant support from our AI chatbot for treatment planning and patient communication.
                </CardContent>
              </Card>
              <Card className="bg-white/50 backdrop-blur-sm dark:bg-gray-800/50 hover:shadow-lg transition-shadow">
                <CardHeader>
                  <ChartBar className="w-12 h-12 mb-4 text-blue-600 dark:text-blue-400" />
                  <CardTitle className="text-blue-600 dark:text-blue-400">
                    Comprehensive Reporting
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  Generate detailed reports with visualizations to enhance diagnostic accuracy and patient understanding.
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
        <section
          id="how-it-works"
          className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800"
        >
          <div className="container mx-auto px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-12 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-cyan-600 dark:from-blue-400 dark:to-cyan-400">
              How It Works
            </h2>
            <div className="grid gap-6 lg:grid-cols-3">
              <Card className="bg-white/50 backdrop-blur-sm dark:bg-gray-800/50 hover:shadow-lg transition-shadow p-6">
                <CardHeader>
                  <Clock className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </CardHeader>
                <CardTitle className="text-blue-600 dark:text-blue-400">
                  1. Upload X-rays
                </CardTitle>
                <CardContent className="text-gray-600 dark:text-gray-300 p-6">
                  Securely upload patient X-rays to our HIPAA-compliant
                  platform.
                </CardContent>
              </Card>
              <Card className="bg-white/50 backdrop-blur-sm dark:bg-gray-800/50 hover:shadow-lg transition-shadow p-6">
                <CardHeader>
                  <Brain className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </CardHeader>
                <CardTitle className="text-blue-600 dark:text-blue-400">
                  2. AI Analysis
                </CardTitle>
                <CardContent className="text-gray-600 dark:text-gray-300 p-6">
                  Our AI algorithms analyze the X-rays and identify optimal
                  implant locations.
                </CardContent>
              </Card>
              <Card className="bg-white/50 backdrop-blur-sm dark:bg-gray-800/50 hover:shadow-lg transition-shadow p-6">
                <CardHeader>
                  <ChartBar className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </CardHeader>
                <CardTitle className="text-blue-600 dark:text-blue-400">
                  3. Review Results
                </CardTitle>
                <CardContent className="text-gray-600 dark:text-gray-300 p-6">
                  Receive a detailed report with implant recommendations and
                  treatment insights.
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
        <section
          id="benefits"
          className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-white to-blue-50 dark:from-gray-800 dark:to-gray-900"
        >
          <div className="container mx-auto px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-12 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-cyan-600 dark:from-blue-400 dark:to-cyan-400">
              Benefits
            </h2>
            <div className="grid gap-6 lg:grid-cols-2">
              <Card className="bg-white/50 backdrop-blur-sm dark:bg-gray-800/50 hover:shadow-lg transition-shadow">
                <CardHeader>
                  <Clock className="w-8 h-8 mb-4 text-blue-600 dark:text-blue-400" />
                  <CardTitle className="text-blue-600 dark:text-blue-400">
                    Save Time
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  Reduce analysis time from hours to minutes, allowing you to
                  see more patients and improve practice efficiency.
                </CardContent>
              </Card>
              <Card className="bg-white/50 backdrop-blur-sm dark:bg-gray-800/50 hover:shadow-lg transition-shadow">
                <CardHeader>
                  <Shield className="w-8 h-8 mb-4 text-blue-600 dark:text-blue-400" />
                  <CardTitle className="text-blue-600 dark:text-blue-400">
                    Improve Accuracy
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  Benefit from AI-driven insights that complement your expertise
                  and enhance diagnostic accuracy.
                </CardContent>
              </Card>
              <Card className="bg-white/50 backdrop-blur-sm dark:bg-gray-800/50 hover:shadow-lg transition-shadow">
                <CardHeader>
                  <ChartBar className="w-8 h-8 mb-4 text-blue-600 dark:text-blue-400" />
                  <CardTitle className="text-blue-600 dark:text-blue-400">
                    Enhance Patient Care
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  Provide patients with clear, visual explanations of their
                  treatment needs, improving understanding and acceptance.
                </CardContent>
              </Card>
              <Card className="bg-white/50 backdrop-blur-sm dark:bg-gray-800/50 hover:shadow-lg transition-shadow">
                <CardHeader>
                  <Zap className="w-8 h-8 mb-4 text-blue-600 dark:text-blue-400" />
                  <CardTitle className="text-blue-600 dark:text-blue-400">
                    Stay Competitive
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  Leverage cutting-edge technology to differentiate your
                  practice and attract tech-savvy patients.
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
        <section
          id="contact"
          className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800"
        >
          <div className="container mx-auto px-4 md:px-6">
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
                <Button
                  className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white"
                  size="lg"
                >
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
      <Footer />
    </div>
  );
};

export default HomePage;
