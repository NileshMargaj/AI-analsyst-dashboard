import React from 'react'
import Query from './Query'
import { FaArrowRight } from "react-icons/fa";
import Card from './Card';

const Dashboard = () => {
    return (
        <>
            <section className='h-full w-full p-3'>
                <div className="w-full  rounded-lg p-4 flex flex-col gap-4">
                    <p className='text-white text-md font-medium'>ASK A QUESTION ?</p>
                    <div className='w-full flex items-center gap-4'>
                        <input type="text"
                            placeholder='Type your question here...'
                            className='py-2.5 w-[80%] pl-2.5  border border-gray-300 text-gray-300 bg-transparent focus:outline-none rounded-lg text-sm' />
                        <button
                            className="py-2.5 px-5 bg-violet-600 text-white rounded-lg hover:bg-violet-700 active:scale-95 transition-all duration-200       focus:outline-none focus:ring-2 focus:ring-violet-400 flex items-center gap-2"
                        >
                            <FaArrowRight className="text-sm" />
                            <span className="text-sm font-medium">Run</span>
                            
                        </button>
                    </div>
                    <Query />
                </div>
                <div className='w-full h-[200px] mt-4 rounded-lg p-4 flex items-center justify-start gap-4'>
                    <Card title={'TOTAL REVENUE'} amount={'$2.4M'} />
                    <Card title={'UNIT SOLD'} amount={'41,209'} />
                    <Card title={'AVG PROFIT MARGIN'} amount={'25.5%'} />
                    <Card title={'ACTIVE CUSTOMERS'} amount={'1,500'} />
                </div>
            </section>
        </>
    )
}

export default Dashboard