import {
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  useDisclosure,
  Button,
  Input
} from '@chakra-ui/react'

import { useRef } from 'react'

const frostedStyle = {
  backgroundColor: 'rgba(255, 255, 255, .15)',
  backdropFilter: 'blur(5px)'
}

export default function SideDrawer() {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const btnRef = useRef()

  const deleteAccount = () => {
    // TODO
    alert('TODO: Delete Account')
  }

  return (
    <>
      <svg ref={btnRef} onClick={onOpen} xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 cursor-pointer" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
      <Drawer
        isOpen={isOpen}
        placement='right'
        onClose={onClose}
        finalFocusRef={btnRef}
      >
        <DrawerOverlay />
        <DrawerContent style={frostedStyle}>
          {/* <DrawerCloseButton /> */}
          <DrawerHeader style={frostedStyle}>User Settings</DrawerHeader>

          <DrawerBody style={frostedStyle}>
            <Input placeholder='Type here...' />
          </DrawerBody>

          <DrawerFooter style={frostedStyle}>
            <Button variant='outline' mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button colorScheme='red' onClick={() => deleteAccount()} >Delete Account</Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  )
}