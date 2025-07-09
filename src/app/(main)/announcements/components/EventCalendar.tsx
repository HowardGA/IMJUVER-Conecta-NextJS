'use client';

import React from 'react';
import { Calendar, Badge, Typography } from 'antd';
import type { CalendarProps } from 'antd';
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs'; 

import { Event } from '@/interfaces/eventInterface';

const { Title } = Typography;

interface EventCalendarProps {
  events: Event[]; 
}

const EventCalendar: React.FC<EventCalendarProps> = ({ events }) => {
  const getListData = (value: Dayjs) => {
    const dayEvents = events.filter(event =>
      dayjs(event.eventDate).isSame(value, 'day')
    );

    return dayEvents.map(event => ({
      type: 'success',
      content: event.title,
    }));
  };

  const cellRender: CalendarProps<Dayjs>['cellRender'] = (current, info) => {
    if (info.type === 'date') {
      const listData = getListData(current);
      return (
        <ul className="events">
          {listData.map((item, index) => (
            <li key={index}>
              <Badge status={item.type as 'success' | 'error' | 'default' | 'processing' | 'warning'} text={item.content} />
            </li>
          ))}
        </ul>
      );
    }
    return info.originNode;
  };

  // Optional: handle month cell render if you want to show events summaries per month
  // const monthCellRender: CalendarProps<Dayjs>['monthCellRender'] = (current, info) => {
  //   if (info.type === 'month') {
  //     // Logic for month view, e.g., count events in month
  //   }
  //   return info.originNode;
  // };

  return (
    <div style={{ padding: '24px', maxWidth: '800px', margin: '0 auto' }}>
      <Title level={2} style={{ textAlign: 'center', marginBottom: '32px' }}>
        Calendario de Eventos
      </Title>
      <Calendar
        cellRender={cellRender}
      />
    </div>
  );
};

export default EventCalendar;