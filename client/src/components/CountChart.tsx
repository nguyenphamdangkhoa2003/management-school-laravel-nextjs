"use client"
import Image from 'next/image';
import { RadialBarChart, RadialBar, Legend, ResponsiveContainer } from 'recharts';

const data = [
    {
        name: 'Total',
        count: 100,
        fill: 'white',
    },
    {
        name: 'Girls',
        count: 40,
        fill: '#fae27c',
    },
    {
        name: 'Boys',
        count: 60,
        fill: '#c3ebfa',
    },


];

const CountChart = () => {
    return (
        <div className='bg-white w-full h-full p-4'>
            <div className='flex w-full justify-between'>
                <h1 className='text-lg font-semibold'>Students</h1>
                <Image src="/moredark.png" alt='' width={20} height={20} />
            </div>
            <div className='w-full h-[75%] relative'>
                <ResponsiveContainer>
                    <RadialBarChart cx="50%" cy="50%" innerRadius="30%" outerRadius="100%" barSize={36} data={data}>
                        <RadialBar
                            background
                            dataKey="count"
                        />
                    </RadialBarChart>
                </ResponsiveContainer>
                <Image src="/maleFemale.png" alt='' width={80} height={80} className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2' />
            </div>
            <div className='flex flex-row gap-16 justify-center'>
                <div className='flex flex-col gap-1'>
                    <div className='w-5 h-5 rounded-full bg-lamaSky' />
                    <h1 className='font-bold'>1.234</h1>
                    <h2 className='text-sm text-gray-300'>Boys (35%)</h2>
                </div>

                <div className='flex flex-col gap-1'>
                    <div className='w-5 h-5 rounded-full bg-lamaYellow' />
                    <h1 className='font-bold'>1.234</h1>
                    <h2 className='text-sm text-gray-300'>Girls (35%)</h2>
                </div>
            </div>
        </div>
    )
}

export default CountChart