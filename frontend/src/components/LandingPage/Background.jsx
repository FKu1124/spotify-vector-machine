import React from 'react'
import { useEffect } from 'react'

import KUTE from 'kute.js'

export default function Background() {

    useEffect(() => {
        // const tweenBlob1 = KUTE.to(
        //     '#blob11',
        //     { path: '#blob12' },
        //     { repeat: 999, duration: 2000, yoyo: true, morphPrecision: 1 }
        // )

        // const tweenBlob2 = KUTE.to(
        //     '#blob21',
        //     { path: '#blob22' },
        //     { repeat: 999, duration: 3000, yoyo: true }
        // )

        // const tweenBlob3 = KUTE.to(
        //     '#blob31',
        //     { path: '#blob32' },
        //     { repeat: 999, duration: 3000, yoyo: true }
        // )

        // tweenBlob1.start()
        // tweenBlob2.start()
        // tweenBlob3.start()
    }, [])

    return (
        <div className='w-full h-screen  bg-deepRed absolute'>
            {/* Waves */}
            <svg id="visual" viewBox="0 0 1920 1080" className='w-full absolute bottom-0 '>
                <g>
                    <path d="M0 784L45.7 779.2C91.3 774.3 182.7 764.7 274.2 739.7C365.7 714.7 457.3 674.3 548.8 666.8C640.3 659.3 731.7 684.7 823 684C914.3 683.3 1005.7 656.7 1097 670.8C1188.3 685 1279.7 740 1371.2 749.3C1462.7 758.7 1554.3 722.3 1645.8 715.3C1737.3 708.3 1828.7 730.7 1874.3 741.8L1920 753L1920 1081L1874.3 1081C1828.7 1081 1737.3 1081 1645.8 1081C1554.3 1081 1462.7 1081 1371.2 1081C1279.7 1081 1188.3 1081 1097 1081C1005.7 1081 914.3 1081 823 1081C731.7 1081 640.3 1081 548.8 1081C457.3 1081 365.7 1081 274.2 1081C182.7 1081 91.3 1081 45.7 1081L0 1081Z" fill="#70ae91"></path>
                    <path d="M0 727L45.7 726C91.3 725 182.7 723 274.2 735.5C365.7 748 457.3 775 548.8 777.5C640.3 780 731.7 758 823 767.7C914.3 777.3 1005.7 818.7 1097 817.3C1188.3 816 1279.7 772 1371.2 748.2C1462.7 724.3 1554.3 720.7 1645.8 721C1737.3 721.3 1828.7 725.7 1874.3 727.8L1920 730L1920 1081L1874.3 1081C1828.7 1081 1737.3 1081 1645.8 1081C1554.3 1081 1462.7 1081 1371.2 1081C1279.7 1081 1188.3 1081 1097 1081C1005.7 1081 914.3 1081 823 1081C731.7 1081 640.3 1081 548.8 1081C457.3 1081 365.7 1081 274.2 1081C182.7 1081 91.3 1081 45.7 1081L0 1081Z" fill="#599f7e"></path>
                    <path d="M0 900L45.7 901C91.3 902 182.7 904 274.2 890C365.7 876 457.3 846 548.8 827.7C640.3 809.3 731.7 802.7 823 817.5C914.3 832.3 1005.7 868.7 1097 889.3C1188.3 910 1279.7 915 1371.2 901.8C1462.7 888.7 1554.3 857.3 1645.8 852.8C1737.3 848.3 1828.7 870.7 1874.3 881.8L1920 893L1920 1081L1874.3 1081C1828.7 1081 1737.3 1081 1645.8 1081C1554.3 1081 1462.7 1081 1371.2 1081C1279.7 1081 1188.3 1081 1097 1081C1005.7 1081 914.3 1081 823 1081C731.7 1081 640.3 1081 548.8 1081C457.3 1081 365.7 1081 274.2 1081C182.7 1081 91.3 1081 45.7 1081L0 1081Z" fill="#40916c"></path>
                    <path d="M0 963L45.7 959.7C91.3 956.3 182.7 949.7 274.2 940C365.7 930.3 457.3 917.7 548.8 918.8C640.3 920 731.7 935 823 933.8C914.3 932.7 1005.7 915.3 1097 908.8C1188.3 902.3 1279.7 906.7 1371.2 907.5C1462.7 908.3 1554.3 905.7 1645.8 909.2C1737.3 912.7 1828.7 922.3 1874.3 927.2L1920 932L1920 1081L1874.3 1081C1828.7 1081 1737.3 1081 1645.8 1081C1554.3 1081 1462.7 1081 1371.2 1081C1279.7 1081 1188.3 1081 1097 1081C1005.7 1081 914.3 1081 823 1081C731.7 1081 640.3 1081 548.8 1081C457.3 1081 365.7 1081 274.2 1081C182.7 1081 91.3 1081 45.7 1081L0 1081Z" fill="#377d5d"></path>
                    <path d="M0 990L45.7 986.2C91.3 982.3 182.7 974.7 274.2 968.7C365.7 962.7 457.3 958.3 548.8 965.2C640.3 972 731.7 990 823 990.5C914.3 991 1005.7 974 1097 975.7C1188.3 977.3 1279.7 997.7 1371.2 1005.8C1462.7 1014 1554.3 1010 1645.8 1008.8C1737.3 1007.7 1828.7 1009.3 1874.3 1010.2L1920 1011L1920 1081L1874.3 1081C1828.7 1081 1737.3 1081 1645.8 1081C1554.3 1081 1462.7 1081 1371.2 1081C1279.7 1081 1188.3 1081 1097 1081C1005.7 1081 914.3 1081 823 1081C731.7 1081 640.3 1081 548.8 1081C457.3 1081 365.7 1081 274.2 1081C182.7 1081 91.3 1081 45.7 1081L0 1081Z" fill="#2f6a4f"></path>
                </g>
            </svg>

            {/* TWO BLOBS */}
            {/* <svg id="visual" viewBox="0 0 1920 1080" width="1920" height="1080">
              <g transform="translate(1387 471)">
                  <path id="blob11" d="M236.9 -195.7C291.5 -120.4 309.6 -22.8 278 42.7C246.5 108.1 165.3 141.4 94.4 162.8C23.5 184.2 -37.1 193.6 -110.4 178C-183.7 162.4 -269.6 121.7 -293.7 55.7C-317.9 -10.4 -280.3 -102 -221 -178.3C-161.8 -254.6 -80.9 -315.7 5.1 -319.7C91.1 -323.8 182.2 -270.9 236.9 -195.7Z" fill="#56CFE1"></path>
              </g>
              <g transform="translate(477 628)">
                  <path id="blob21" d="M186.6 -149.5C234 -89.4 259.1 -12.2 242.4 53C225.6 118.2 166.9 171.5 99.5 202.5C32 233.4 -44.3 241.9 -106.6 214.6C-168.8 187.2 -217.1 123.9 -236.7 50.5C-256.3 -23 -247.2 -106.5 -203 -165.9C-158.8 -225.3 -79.4 -260.6 -4.9 -256.7C69.6 -252.8 139.2 -209.7 186.6 -149.5Z" fill="#56CFE1"></path>
              </g>
              <g transform="translate(745 390)" className='hidden'>
                  <path id="blob12" d="M157.2 -131.8C192.6 -80.9 202.7 -16.1 191.5 48.1C180.4 112.3 147.9 176 86.2 222.3C24.5 268.7 -66.4 297.7 -125.5 266.9C-184.5 236 -211.7 145.3 -234.2 51.9C-256.7 -41.4 -274.6 -137.3 -234.8 -189.2C-194.9 -241.2 -97.5 -249.2 -18.3 -234.6C60.8 -220 121.7 -182.8 157.2 -131.8Z" fill="#56CFE1"></path>
              </g>
              <g transform="translate(1494 622)" className='hidden'>
                  <path id="blob22" d="M158 -121.2C193.8 -81 204.5 -15.9 186.3 34C168.1 83.9 121 118.6 65.9 150.3C10.8 182 -52.2 210.6 -99.6 193.1C-146.9 175.5 -178.6 111.8 -195.7 42.9C-212.7 -25.9 -215.2 -99.7 -180.2 -139.8C-145.1 -179.8 -72.6 -186 -5.8 -181.4C61 -176.8 122.1 -161.4 158 -121.2Z" fill="#56CFE1"></path>
              </g>
          </svg> */}


            {/* THREE BLOBS */}
            {/* <svg id="visual" viewBox="0 0 1920 1080" className='w-full h-full'>
              <g>
                  <g transform="translate(301 554)">
                      <path id="blob11" d="M113.6 -89.7C143.6 -52.9 162 -5.9 158.7 47.3C155.4 100.6 130.5 160 89 177C47.4 194.1 -10.8 168.7 -57 138.7C-103.2 108.6 -137.3 73.9 -149.2 31.3C-161.1 -11.2 -150.7 -61.6 -122.2 -98C-93.6 -134.5 -46.8 -157 -2.5 -155C41.8 -153 83.6 -126.5 113.6 -89.7Z" fill="#56cfe1"></path>
                  </g>
                  <g transform="translate(1489 679)">
                      <path id="blob21" d="M126.7 -107.2C156.8 -63.2 168.8 -11 156.1 32C143.4 75 106 108.8 57 141C8 173.3 -52.6 204.2 -101.4 188.9C-150.3 173.7 -187.4 112.5 -205.3 44.1C-223.1 -24.4 -221.7 -100 -184.3 -145.6C-146.8 -191.3 -73.4 -206.9 -12.6 -196.8C48.3 -186.8 96.5 -151.1 126.7 -107.2Z" fill="#56cfe1"></path>
                  </g>
                  <g transform="translate(936 476)">
                      <path id="blob31" d="M153.3 -122.9C178.1 -91.2 163.4 -28.6 144.6 24.7C125.8 78 102.9 122 64.2 145.1C25.5 168.3 -28.9 170.7 -76.8 150.9C-124.8 131.1 -166.2 89.3 -172.3 44.5C-178.3 -0.2 -149 -47.9 -114.4 -81.8C-79.8 -115.7 -39.9 -135.9 12.2 -145.6C64.3 -155.3 128.5 -154.5 153.3 -122.9Z" fill="#56cfe1"></path>
                  </g>

                  <g transform="translate(1484 488)" className='hidden'>
                      <path id="blob12" d="M146.6 -120.8C187.7 -65.4 217.1 -4.5 209.2 54.8C201.3 114.1 156 172 93.9 206.2C31.9 240.3 -47 250.8 -105.8 221.7C-164.7 192.6 -203.6 124 -209.7 58.8C-215.9 -6.4 -189.3 -68.1 -148.9 -123.4C-108.5 -178.6 -54.3 -227.5 -0.8 -226.9C52.7 -226.3 105.5 -176.2 146.6 -120.8Z" fill="#56cfe1"></path>
                  </g>
                  <g transform="translate(785 777)" className='hidden'>
                      <path id="blob22" d="M121.9 -76.9C164.6 -43.7 210.3 7.4 205.8 55C201.3 102.6 146.6 146.7 86.9 172.4C27.1 198.1 -37.6 205.4 -90.9 182.2C-144.1 159.1 -185.8 105.5 -187 55.5C-188.2 5.5 -148.9 -41 -111 -73.1C-73.1 -105.1 -36.5 -122.8 1.5 -124C39.6 -125.2 79.2 -110 121.9 -76.9Z" fill="#56cfe1"></path>
                  </g>
                  <g transform="translate(347 342)" className='hidden'>
                      <path id="blob32" d="M121.3 -85.9C161.1 -46.8 200 3.9 192.5 46.8C184.9 89.7 131 124.9 75.4 148.7C19.7 172.5 -37.7 184.9 -89.2 167.1C-140.8 149.2 -186.5 101.1 -202.2 43.1C-217.9 -14.9 -203.5 -82.9 -164.8 -121.8C-126.1 -160.6 -63.1 -170.4 -11.2 -161.5C40.7 -152.6 81.5 -125 121.3 -85.9Z" fill="#56cfe1"></path>
                  </g>
              </g>
        </svg> */}
        </div>
    );
}
