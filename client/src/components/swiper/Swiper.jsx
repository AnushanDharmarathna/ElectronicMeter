import React from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Pagination, Navigation, EffectFade, Autoplay } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/pagination'
import 'swiper/css/navigation'
import 'swiper/css/effect-fade'
import BgItems from '../../assets/Js/BgItems'

const SwiperImage = () => {
  return (
    <div className='w-full h-full'>
        <Swiper
        spaceBetween={50}
        slidesPerView={1}
        // effect={'fade'}
        loop={true}
        autoplay={{
          delay: 2500,
          disableOnInteraction: true,
        }}
        // pagination={{
        //   clickable: true,
        // }}
        navigation={false}
        modules={[Pagination, Navigation, EffectFade, Autoplay]}
        >
            <SwiperSlide>
                <div>
                    <img src={BgItems.Swiper_1} alt='' />
                </div>
            </SwiperSlide>
            <SwiperSlide>
                <div>
                    <img src={BgItems.Swiper_2} alt='' />
                </div>
            </SwiperSlide>
            <SwiperSlide>
                <div>
                    <img src={BgItems.Swiper_3} alt='' />
                </div>
            </SwiperSlide>
        </Swiper>

    </div>
  )
}
export default SwiperImage