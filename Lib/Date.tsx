export class DateExpand {
    static GetTime(date: Date) {
        const noon = (date.getHours() >= 12 ? "오후 " : "오전 ");
        const time = (noon + (date.getHours() % 12)) + ":" + date.getMinutes();
        const str = `${date.getMonth() + 1}월 ${date.getDate()}일 ${time}`;

        return str;
    }
}