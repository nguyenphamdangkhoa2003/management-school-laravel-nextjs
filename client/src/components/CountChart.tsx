"use client";
import Image from 'next/image';
import { RadialBarChart, RadialBar, ResponsiveContainer } from 'recharts';

const CountChart = ({ data }: { data: any[] }) => {
    // Lấy số lượng nam, nữ và tổng số sinh viên từ data
    const totalStudents = data.find(item => item.name === "Tổng")?.count || 0;
    const maleStudents = data.find(item => item.name === "Nam")?.count || 0;
    const femaleStudents = data.find(item => item.name === "Nữ")?.count || 0;

    // Tính % nam, nữ (tránh chia cho 0)
    const malePercentage = totalStudents ? ((maleStudents / totalStudents) * 100).toFixed(1) : 0;
    const femalePercentage = totalStudents ? ((femaleStudents / totalStudents) * 100).toFixed(1) : 0;

    return (
        <div className='bg-white w-full h-full p-4'>
            <div className='flex w-full justify-between'>
                <h1 className='text-lg font-semibold'>Students</h1>
                <Image src="/moredark.png" alt='' width={20} height={20} />
            </div>
            <div className='w-full h-[75%] relative'>
                <ResponsiveContainer>
                    <RadialBarChart cx="50%" cy="50%" innerRadius="30%" outerRadius="100%" barSize={36} data={data}>
                        <RadialBar background dataKey="count" />
                    </RadialBarChart>
                </ResponsiveContainer>
                <Image src="/maleFemale.png" alt='' width={80} height={80} className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2' />
            </div>
            <div className='flex flex-row gap-16 justify-center'>
                {/* Hiển thị thông tin số lượng nam */}
                <div className='flex flex-col gap-1 items-center'>
                    <div className='w-5 h-5 rounded-full' style={{ backgroundColor: '#c3ebfa' }} />
                    <h1 className='font-bold'>{maleStudents}</h1>
                    <h2 className='text-sm text-gray-400'>Nam ({malePercentage}%)</h2>
                </div>
                {/* Hiển thị thông tin số lượng nữ */}
                <div className='flex flex-col gap-1 items-center'>
                    <div className='w-5 h-5 rounded-full' style={{ backgroundColor: '#fae27c' }} />
                    <h1 className='font-bold'>{femaleStudents}</h1>
                    <h2 className='text-sm text-gray-400'>Nữ ({femalePercentage}%)</h2>
                </div>
            </div>
        </div>
    );
};

export default CountChart;
