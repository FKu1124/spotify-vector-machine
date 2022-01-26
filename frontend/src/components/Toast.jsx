import { Fragment, useState, useEffect } from 'react'
import { Transition } from '@headlessui/react'

export default function Toast({ duration, line1, line2 }) {
	const [open, setOpen] = useState(true)

	useEffect(() => {
		// Close Toast after duration (in ms)
		setTimeout(() => setOpen(false), duration)
	}, [])


	return (
		<Transition.Root show={open} as={Fragment}>
			<div className="fixed z-10 overflow-y-auto right-10">
				<div className="flex items-end justify-center min-h-screen pt-4 px-4 text-center sm:block sm:p-0">
					<Transition.Child
						as={Fragment}
						enter="ease-out duration-300"
						enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
						enterTo="opacity-100 translate-y-0 sm:scale-100"
						leave="ease-in duration-200"
						leaveFrom="opacity-100 translate-y-0 sm:scale-100"
						leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
					>
						<div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full py-0">
							<div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4 py-0">
								<div className="sm:flex sm:items-start py-0">
									<div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left py-0">
										<p className="text-sm text-gray-500">
											{line1}
										</p><p className="text-sm text-gray-500">
											{line2}
										</p>
									</div>
								</div>
							</div>
						</div>
					</Transition.Child>
				</div>
			</div>
		</Transition.Root>
	)
}
