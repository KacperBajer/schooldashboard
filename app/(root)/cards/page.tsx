import CardsTable from '@/components/CardsTable'
import { getCards } from '@/lib/cards'
import React from 'react'

const page = async ({ params, searchParams }: any) => {

  const cards = await getCards('1')
  const { p, lname, fname, id, cardid, group, classname } = await searchParams;
  return (
    <div className='p-4 md:pl-0'>
      <CardsTable 
        data={cards} 
        cardid={cardid}
        fname={fname}
        group={group}
        id={id}
        lname={lname}
        class_name={classname}
      />
    </div>
  )
}

export default page