import './Footer.css'

const Footer = () => {
	return (
		<footer className='flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t bg-gradient-to-b from-white to-blue-50 dark:from-gray-800 dark:to-gray-900'>
			<p className='text-xs text-gray-600 dark:text-gray-400'>
				© 2024 Ortho Vision. All rights reserved.
			</p>
			<nav className='sm:ml-auto flex gap-4 sm:gap-6'>
				<a
					className='footer-link'
					href='#'
				>
					Terms of Service
				</a>
				<a
					className='footer-link'
					href='#'
				>
					Privacy
				</a>
			</nav>
		</footer>
	)
}

export default Footer
