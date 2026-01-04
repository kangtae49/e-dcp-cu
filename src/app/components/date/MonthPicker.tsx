import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { ko } from 'date-fns/locale';
import "./MonthPicker.css"
import {FontAwesomeIcon as Icon} from "@fortawesome/react-fontawesome"
import {faCalendar} from "@fortawesome/free-solid-svg-icons"
import {format, parse} from "date-fns";

interface Props {
  value?: string | null
  onChange?: (date: string | null) => void
}

function MonthPicker ({value, onChange}: Props) {

  const handleChange = (date: string | null) => {
    if (onChange) {
      onChange(date)
    }
  }
  return (
    <div className="month-picker">
      <DatePicker

        // withPortal
        showIcon
        locale={ko}
        showMonthYearPicker
        popperPlacement="bottom-start"
        todayButton="오늘"
        dateFormat="yyyy-MM"
        showYearDropdown
        scrollableYearDropdown
        icon={<Icon icon={faCalendar} />}
        toggleCalendarOnIconClick
        yearDropdownItemNumber={15}
        selected={parse(value ?? format(new Date(), "yyyy-MM-dd"), "yyyy-MM-dd", new Date())}
        onChange={(date) => handleChange(format(date ?? new Date(), "yyyy-MM-dd"))}
      />
    </div>
  );
}

export default MonthPicker;