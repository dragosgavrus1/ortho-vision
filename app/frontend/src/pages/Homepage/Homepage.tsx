import { Button } from '@/components/Button/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/Card/Card'
import Footer from '@/components/Footer/Footer'
import Navbar from '@/components/Navbar/Navbar'
import { jwtDecode } from 'jwt-decode'
import { Brain, BarChartIcon as ChartBar, Clock, Shield, Zap } from 'lucide-react'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const HomePage = () => {
	const navigate = useNavigate()

	// Function to check if the JWT token is valid
	const isTokenValid = (token: string | null): boolean => {
		if (!token) return false

		try {
			const decoded = jwtDecode(token) // Decode the JWT token
			const currentTime = Date.now() / 1000 // Current time in seconds
			if (decoded.exp && decoded.exp < currentTime) {
				return false // Token is expired
			}
			return true // Token is valid
		} catch (e) {
			console.error('Invalid token', e)
			return false
		}
	}

	// Redirect to Sign In page if not logged in
	useEffect(() => {
		const token = localStorage.getItem('jwtToken')
		if (!isTokenValid(token)) {
			navigate('/signin') // Redirect to Sign In page if the user is not logged in
		}
	}, [navigate])

	// Handle Sign In click
	const handleSignInClick = () => {
		navigate('/signin') // Redirect to the SignIn page
	}

	// Handle Log Out
	const handleLogout = () => {
		localStorage.removeItem('jwtToken')
		navigate('/signin')
	}

	return (
		<div className='flex flex-col min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800'>
			<Navbar handleSignInClick={handleSignInClick} handleLogout={handleLogout} />
			<main className='flex-1'>
				<section className='w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-gradient-to-br from-blue-100 via-white to-blue-50 dark:from-gray-800 dark:via-gray-900 dark:to-gray-800'>
					<div className='container px-4 md:px-6'>
						<div className='grid gap-6 lg:grid-cols-[1fr_600px] lg:gap-12 xl:grid-cols-[1fr_800px]'>
							<div className='max-w-full'>
								<div className='border border-gray-200 shadow-lg rounded-lg overflow-hidden transform transition-transform hover:scale-105'>
									<img
										src='https://media.istockphoto.com/id/171294275/photo/panoramic-dental-x-ray.jpg?s=612x612&w=0&k=20&c=cKxtL1W0L2LKVoZnNfiUj8umm6kQDonINuhn8NdCda4='
										alt='Dental X-ray with AI analysis'
										className='w-full h-auto object-cover'
									/>
								</div>
							</div>
							<div className='flex flex-col justify-center space-y-4'>
								<div className='space-y-2'>
									<h1 className='text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-cyan-600 dark:from-blue-400 dark:to-cyan-400'>
										Revolutionary Dental AI Analysis
									</h1>
									<p className='max-w-[600px] text-gray-600 md:text-xl dark:text-gray-300'>
										Harness the power of AI to analyze X-rays and provide
										comprehensive implant recommendations with unparalleled
										accuracy.
									</p>
								</div>
								<div className='flex flex-col gap-2 min-[400px]:flex-row'>
									<Button
										size='lg'
										className='bg-blue-600 hover:bg-blue-700 text-white'
									>
										Get Started
									</Button>
									<Button
										size='lg'
										variant='outline'
										className='text-blue-600 border-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:border-blue-400 dark:hover:bg-gray-700'
									>
										Learn More
									</Button>
								</div>
							</div>
						</div>
					</div>
				</section>
				<section
					id='features'
					className='w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-white to-blue-50 dark:from-gray-800 dark:to-gray-900'
				>
					<div className='container px-4 md:px-6'>
						<h2 className='text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-12 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-cyan-600 dark:from-blue-400 dark:to-cyan-400'>
							Key Features
						</h2>
						<div className='grid gap-6 lg:grid-cols-3'>
							<Card className='bg-white/50 backdrop-blur-sm dark:bg-gray-800/50 hover:shadow-lg transition-shadow'>
								<CardHeader>
									<Brain className='w-12 h-12 mb-4 text-blue-600 dark:text-blue-400' />
									<CardTitle className='text-blue-600 dark:text-blue-400'>
										AI-Powered Analysis
									</CardTitle>
								</CardHeader>
								<CardContent>
									Advanced machine learning algorithms analyze X-rays with high
									precision, identifying potential implant sites.
								</CardContent>
							</Card>
							<Card className='bg-white/50 backdrop-blur-sm dark:bg-gray-800/50 hover:shadow-lg transition-shadow'>
								<CardHeader>
									<Zap className='w-12 h-12 mb-4 text-blue-600 dark:text-blue-400' />
									<CardTitle className='text-blue-600 dark:text-blue-400'>
										Instant Results
									</CardTitle>
								</CardHeader>
								<CardContent>
									Receive comprehensive analysis and implant recommendations
									within seconds of uploading X-rays.
								</CardContent>
							</Card>
							<Card className='bg-white/50 backdrop-blur-sm dark:bg-gray-800/50 hover:shadow-lg transition-shadow'>
								<CardHeader>
									<ChartBar className='w-12 h-12 mb-4 text-blue-600 dark:text-blue-400' />
									<CardTitle className='text-blue-600 dark:text-blue-400'>
										Detailed Reporting
									</CardTitle>
								</CardHeader>
								<CardContent>
									Generate in-depth reports with visualizations to support
									treatment planning and patient communication.
								</CardContent>
							</Card>
						</div>
					</div>
				</section>
				<section
					id='how-it-works'
					className='w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800'
				>
					<div className='container px-4 md:px-6'>
						<h2 className='text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-12 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-cyan-600 dark:from-blue-400 dark:to-cyan-400'>
							How It Works
						</h2>
						<div className='grid gap-6 lg:grid-cols-3'>
							<Card className='bg-white/50 backdrop-blur-sm dark:bg-gray-800/50 hover:shadow-lg transition-shadow p-6'>
								<CardHeader>
									<Clock className='w-6 h-6 text-blue-600 dark:text-blue-400' />
								</CardHeader>
								<CardTitle className='text-blue-600 dark:text-blue-400'>
									1. Upload X-rays
								</CardTitle>
								<CardContent className='text-gray-600 dark:text-gray-300 p-6'>
									Securely upload patient X-rays to our HIPAA-compliant platform.
								</CardContent>
							</Card>
							<Card className='bg-white/50 backdrop-blur-sm dark:bg-gray-800/50 hover:shadow-lg transition-shadow p-6'>
								<CardHeader>
									<Brain className='w-6 h-6 text-blue-600 dark:text-blue-400' />
								</CardHeader>
								<CardTitle className='text-blue-600 dark:text-blue-400'>
									2. AI Analysis
								</CardTitle>
								<CardContent className='text-gray-600 dark:text-gray-300 p-6'>
									Our AI algorithms analyze the X-rays and identify optimal
									implant locations.
								</CardContent>
							</Card>
							<Card className='bg-white/50 backdrop-blur-sm dark:bg-gray-800/50 hover:shadow-lg transition-shadow p-6'>
								<CardHeader>
									<ChartBar className='w-6 h-6 text-blue-600 dark:text-blue-400' />
								</CardHeader>
								<CardTitle className='text-blue-600 dark:text-blue-400'>
									3. Review Results
								</CardTitle>
								<CardContent className='text-gray-600 dark:text-gray-300 p-6'>
									Receive a detailed report with implant recommendations and
									treatment insights.
								</CardContent>
							</Card>
						</div>
					</div>
				</section>
				<section
					id='benefits'
					className='w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-white to-blue-50 dark:from-gray-800 dark:to-gray-900'
				>
					<div className='container px-4 md:px-6'>
						<h2 className='text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-12 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-cyan-600 dark:from-blue-400 dark:to-cyan-400'>
							Benefits
						</h2>
						<div className='grid gap-6 lg:grid-cols-2'>
							<Card className='bg-white/50 backdrop-blur-sm dark:bg-gray-800/50 hover:shadow-lg transition-shadow'>
								<CardHeader>
									<Clock className='w-8 h-8 mb-4 text-blue-600 dark:text-blue-400' />
									<CardTitle className='text-blue-600 dark:text-blue-400'>
										Save Time
									</CardTitle>
								</CardHeader>
								<CardContent>
									Reduce analysis time from hours to minutes, allowing you to see
									more patients and improve practice efficiency.
								</CardContent>
							</Card>
							<Card className='bg-white/50 backdrop-blur-sm dark:bg-gray-800/50 hover:shadow-lg transition-shadow'>
								<CardHeader>
									<Shield className='w-8 h-8 mb-4 text-blue-600 dark:text-blue-400' />
									<CardTitle className='text-blue-600 dark:text-blue-400'>
										Improve Accuracy
									</CardTitle>
								</CardHeader>
								<CardContent>
									Benefit from AI-driven insights that complement your expertise
									and enhance diagnostic accuracy.
								</CardContent>
							</Card>
							<Card className='bg-white/50 backdrop-blur-sm dark:bg-gray-800/50 hover:shadow-lg transition-shadow'>
								<CardHeader>
									<ChartBar className='w-8 h-8 mb-4 text-blue-600 dark:text-blue-400' />
									<CardTitle className='text-blue-600 dark:text-blue-400'>
										Enhance Patient Care
									</CardTitle>
								</CardHeader>
								<CardContent>
									Provide patients with clear, visual explanations of their
									treatment needs, improving understanding and acceptance.
								</CardContent>
							</Card>
							<Card className='bg-white/50 backdrop-blur-sm dark:bg-gray-800/50 hover:shadow-lg transition-shadow'>
								<CardHeader>
									<Zap className='w-8 h-8 mb-4 text-blue-600 dark:text-blue-400' />
									<CardTitle className='text-blue-600 dark:text-blue-400'>
										Stay Competitive
									</CardTitle>
								</CardHeader>
								<CardContent>
									Leverage cutting-edge technology to differentiate your practice
									and attract tech-savvy patients.
								</CardContent>
							</Card>
						</div>
					</div>
				</section>
				<section
					id='contact'
					className='w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800'
				>
					<div className='container px-4 md:px-6'>
						<div className='flex flex-col items-center justify-center space-y-4 text-center'>
							<div className='space-y-2'>
								<h2 className='text-3xl font-bold tracking-tighter sm:text-5xl bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-cyan-600 dark:from-blue-400 dark:to-cyan-400'>
									Ready to Transform Your Practice?
								</h2>
								<p className='max-w-[900px] text-gray-600 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-300'>
									Join the dental AI revolution and elevate your implant planning
									process. Contact us for a demo or to learn more.
								</p>
							</div>
							<div className='w-full max-w-sm space-y-2'>
								<Button
									className='w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white'
									size='lg'
								>
									Request a Demo
								</Button>
								<Button className='w-full' variant='outline' size='lg'>
									Contact Sales
								</Button>
							</div>
						</div>
					</div>
				</section>
			</main>
			<Footer />
		</div>
	)
}

export default HomePage
