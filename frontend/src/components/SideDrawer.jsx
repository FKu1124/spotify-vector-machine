import {
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  useDisclosure,
  Button,
  Stack,
  Box,
  FormLabel,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  Link,
  Icon,
  DrawerCloseButton
} from '@chakra-ui/react'
import { HiExternalLink } from 'react-icons/hi'
import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import { URL_ACCOUNTS } from './../Config'
 

const frostedStyle = {
  backgroundColor: 'rgba(255, 255, 255, .15)',
  backdropFilter: 'blur(5px)'
}

const MIN = 10
const MAX = 100
const STEP = 1

export default function SideDrawer() {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [defaultVolume, setDefaultVolume] = useState(localStorage.getItem('svmPlayerDefaultVolume' || 30))
	const navigate = useNavigate()
  const [cookies, setCookies, removeCookie] = useCookies(['csrftoken','sessionid']);
  const btnRef = useRef()

  const deleteAccount = () => {
    // TODO
    alert('TODO: Delete Account')
  }

  const logout = async() => {
    await fetch(`${URL_ACCOUNTS}logout`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'X-CSRFToken': cookies['csrftoken']
      },
      credentials: 'include'
    })
    navigate('/login')
  }

  const saveDefaultValue = (vol) => {
    setDefaultVolume(vol)
    localStorage.setItem('svmPlayerDefaultVolume', vol)
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
          <DrawerCloseButton />
          <DrawerHeader style={frostedStyle}>User Settings</DrawerHeader>
          <DrawerBody style={frostedStyle} className="flex flex-col justify-between">
            <Stack spacing='24px' className='mt-10'>
              <Box>
                <FormLabel>Default Player Volume</FormLabel>
                <Slider aria-label='slider-ex-1' defaultValue={defaultVolume} min={MIN} max={MAX} step={STEP} value={defaultVolume} onChange={(value) => saveDefaultValue(value)}>
                  <SliderTrack>
                    <SliderFilledTrack bg='blue.900' />
                  </SliderTrack>
                  <SliderThumb bg='green.400' />
                </Slider>
              </Box>
              <Box>
                <FormLabel>Tastes</FormLabel>
                <Box className='mx-2'>
                  <p>Drake, Kanye West, ...</p>
                </Box>
              </Box>
            </Stack>
            <Link href='https://www.spotify.com/us/account/apps/' isExternal className='font-bold' >
              Revoke Spotify Access <Icon w={4} h={4} as={HiExternalLink} className='mb-1' />
            </Link>
          </DrawerBody>
          <DrawerFooter style={frostedStyle}>
            {/* <Button variant='outline' mr={3} onClick={onClose}>Cancel</Button> */}
            <Button variant='outline' mr={3} onClick={() => logout()}>Log Out</Button>
            <Button colorScheme='red' onClick={() => deleteAccount()} >Delete Account</Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  )
}