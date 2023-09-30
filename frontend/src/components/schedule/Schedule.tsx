import React, { useState, useLayoutEffect } from 'react';
import CustomCalendar from '@/utils/calendar/CustomCalendar';
import { getMonthFirstDate, getMonthLastDate, toStringByFormatting, differDate } from '@/utils/date/DateFormatter';
import { getMonthScheduleList } from '@/api/Schedule';
import { ScheduleType } from '@/type/ScheduleType';
import ScheduleItem from './item/ScheduleItem';
import ScheduleView from './ScheduleView';

const Schedule = () => {

    const [curDate, setCurDate] = useState<Date>(new Date());
    const [selectedDate, setSelectedDate] = useState("");
    const [curMonth, setCurMonth] = useState<number>(curDate.getMonth() + 1);
    const [firstDate, setFirstDate] = useState<Date>(new Date(curDate.getFullYear(), curDate.getMonth(), 1));
    const [lastDate, setLastDate] = useState<Date>(new Date(curDate.getFullYear(), curDate.getMonth() + 1, 0));
    const [dataList, setDataList] = useState<ScheduleType[]>([]);
    const [dateContentsList, setDateContentsList] = useState<JSX.Element[]>([]);

    const getDateConentsList = async () => {
        setSelectedDate(() => "");
        await getMonthScheduleList(
            {startDay : toStringByFormatting(firstDate), endDay : toStringByFormatting(lastDate)},
            ({data}) => {setDataList(() => data.data as ScheduleType[]);}, (error) => console.log(error));
    };

    useLayoutEffect(() => {
        setCurMonth(() => curDate.getMonth() + 1);
        setFirstDate(() => getMonthFirstDate(curDate));
        setLastDate(() => getMonthLastDate(curDate));
    }, [curDate]);

    useLayoutEffect(() => {void getDateConentsList();},[firstDate, lastDate]);

    useLayoutEffect(() => {
        const elementList:JSX.Element[] = [];
        dataList.map((item) => {
            elementList.push(<ScheduleItem activeStatus={selectedDate == item.selectedDate} colorCode={item.colorCode} dateText={item.selectedDate} clickStatus={item.status !== "X" || differDate(new Date(item.selectedDate), new Date()) > 0} clickEvent={setSelectedDate} />);
        });
        setDateContentsList(() => elementList);
    }, [dataList, selectedDate]);

    function prevMonthEvent(){
        const prevMonth = new Date(curDate);
        prevMonth.setMonth(prevMonth.getMonth() - 1);
        setCurDate(() => prevMonth);
        setSelectedDate(() => "");
    }

    function nextMonthEvent(){
        const nextMonth = new Date(curDate);
        nextMonth.setMonth(nextMonth.getMonth() + 1);
        setCurDate(() => nextMonth);
        setSelectedDate(() => "");
    }

    return (
        <>
            <CustomCalendar curMonth={curMonth!} firstDate={firstDate!} lastDate={lastDate!} dateContents={dateContentsList} prevMonthEvent={prevMonthEvent} nextMonthEvent={nextMonthEvent} />
            {selectedDate != "" ? <div className="mt-[20px]"><ScheduleView selectedDate={selectedDate} /></div> : null}
        </>
    )
}

export default Schedule;