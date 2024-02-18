
import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import './MyDatePicker.scss';

let oneDay = 60 * 60 * 24 * 1000;
let todayTimestamp = Date.now() - (Date.now() % oneDay) + (new Date().getTimezoneOffset() * 1000 * 60);
let toInputRef = React.createRef();
let fromInputRef = React.createRef();

export default class MyDatePicker extends Component {
  state = {
    getMonthDetails: [],
  };

  constructor() {
    super();
    let date = new Date();
    let year = date.getFullYear();
    let month = date.getMonth();
    let prevMonth = month === 0 ? 11 : month - 1;
    let prevYear = year - 1;
    this.state = {
      year,
      month,
      selectedToDay: null,
      selectedFromDay: null,
      today: todayTimestamp,
      toDate: null,
      fromDate: null,
      monthDetails: this.getMonthDetails(year, month),
      prevMonthDetails: this.getMonthDetails(
        month === 0 ? prevYear : year,
        prevMonth
      ),
      weekendsInRange: [],
    };
  }

  componentDidUpdate(prevProps, prevState) {

    function getDatesInRange(startDate, endDate) {
      const date = new Date(startDate.getTime());
      const dates = [];

      while (date <= endDate) {
        dates.push({
          date: new Date(date),
          isWeekend:
            new Date(date).getDay() === 6 || new Date(date).getDay() === 0,
        });
        date.setDate(date.getDate() + 1);
      }

      return dates;
    }

    if (this.state.toDate && this.state.fromDate && (prevState.toDate !== this.state.toDate || prevState.fromDate !== this.state.fromDate )) {
        let dates = []
        let d1 = new Date(this.state.fromDate)
        let d2 = new Date(this.state.toDate)
        dates = getDatesInRange(d1, d2)
        let weekends = dates.filter((o)=> o.isWeekend === true)
        let weekendArray = weekends.map((o)=>{
            return o.date.toLocaleDateString('en-GB')
        })
        this.setState({
            weekendsInRange: weekendArray
        })
    }
  }

  componentDidMount() {
    window.addEventListener("click", this.addBackDrop);
    this.setDateToInput(this.state.today);
  }

  componentWillUnmount() {
    window.removeEventListener("click", this.addBackDrop);
  }

  addBackDrop = (e) => {
    if (
      this.state.showDatePicker &&
      !ReactDOM.findDOMNode(this).contains(e.target)
    ) {
      this.showDatePicker(false);
    }
  };

  showDatePicker = (showDatePicker = true) => {
    this.setState({ showDatePicker });
  };

  /**
   *  Core
   */

  daysMap = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  monthMap = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  getDayDetails = (args) => {
    let date = args.index - args.firstDay;
    let day = args.index % 7;
    let prevMonth = args.month - 1;
    let prevYear = args.year;
    if (prevMonth < 0) {
      prevMonth = 11;
      prevYear--;
    }
    let prevMonthNumberOfDays = this.getNumberOfDays(prevYear, prevMonth);
    let _date =
      (date < 0 ? prevMonthNumberOfDays + date : date % args.numberOfDays) + 1;
    let month = date < 0 ? -1 : date >= args.numberOfDays ? 1 : 0;
    let timestamp = new Date(args.year, args.month, _date).getTime();
    return {
      date: _date,
      day,
      month,
      timestamp,
      dayString: this.daysMap[day],
    };
  };

  getPrevNumberOfDays = (year, month) => {
    return 40 - new Date(year, month, 40).getDate();
  };
  getNumberOfDays = (year, month) => {
    return 40 - new Date(year, month, 40).getDate();
  };

  getPrevMonthDetails = (year, month) => {
    let firstDay = new Date(year, month).getDay();
    let numberOfDays = this.getNumberOfDays(year, month);
    let monthArray = [];
    let rows = 7;
    let currentDay = null;
    let index = 0;
    let cols = 7;

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        currentDay = this.getDayDetails({
          index,
          numberOfDays,
          firstDay,
          year,
          month,
        });
        monthArray.push(currentDay);
        index++;
      }
    }
    return monthArray;
  };

  getMonthDetails = (year, month) => {
    let firstDay = new Date(year, month).getDay();
    let numberOfDays = this.getNumberOfDays(year, month);
    let monthArray = [];
    let rows = 7;
    let currentDay = null;
    let index = 0;
    let cols = 7;

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        currentDay = this.getDayDetails({
          index,
          numberOfDays,
          firstDay,
          year,
          month,
        });
        monthArray.push(currentDay);
        index++;
      }
    }
    return monthArray;
  };

  isCurrentDay = (day) => {
    return day.timestamp === todayTimestamp;
  };

  isToOrFromDay = (day) => {
    return (
      day.timestamp === this.state.toDate ||
      day.timestamp === this.state.fromDate
    );
  };

  isInRange = (day) => {
    return (
      day.timestamp < this.state.toDate && day.timestamp > this.state.fromDate
    );
  };

  isWeekend = (day) => {
    return day.dayString === "Saturday" || day.dayString === "Sunday";
  };

  getDateFromDateString = (dateValue) => {
    let dateData = dateValue.split("-").map((d) => parseInt(d, 10));
    if (dateData.length < 3) return null;

    let year = dateData[0];
    let month = dateData[1];
    let date = dateData[2];
    return { year, month, date };
  };

  getMonthStr = (month) =>
    this.monthMap[Math.max(Math.min(11, month), 0)] || "Month";

  getDateStringFromTimestamp = (timestamp) => {
    let dateObject = new Date(timestamp);
    let month = dateObject.getMonth() + 1;
    let date = dateObject.getDate();
    return (
      dateObject.getFullYear() +
      "-" +
      (month < 10 ? "0" + month : month) +
      "-" +
      (date < 10 ? "0" + date : date)
    );
  };

  setDate = (dateData) => {
    // let selectedDay = new Date(dateData.year, dateData.month-1, dateData.date).getTime();
    // this.setState({ selectedDay })
    // if(this.props.onChange) {
    //     this.props.onChange(selectedDay);
    // }
  };

  updateDateFromInput = () => {
    // let dateValue = inputRef.current.value;
    // let dateData = this.getDateFromDateString(dateValue);
    // if(dateData !== null) {
    //     this.setDate(dateData);
    //     this.setState({
    //         year: dateData.year,
    //         month: dateData.month-1,
    //         monthDetails: this.getMonthDetails(dateData.year, dateData.month-1)
    //         prevMonthDetails: this.getMonthDetails(month === 0 ? prevYear : year , prevMonth )
    //     })
    // }
  };

  setDateToInput = (timestamp, toOrFrom) => {
    if (timestamp && toOrFrom === "to") {
      let dateString = this.getDateStringFromTimestamp(timestamp);
      toInputRef.current.value = dateString ? dateString : null;
    } else if (timestamp && toOrFrom === "from") {
      let dateString = this.getDateStringFromTimestamp(timestamp);
      fromInputRef.current.value = dateString ? dateString : null;
    } else if (!timestamp && toOrFrom === "to") {
      toInputRef.current.value = null;
    } else if (!timestamp && toOrFrom === "from") {
      toInputRef.current.value = null;
    }
  };

  onDateClick = (day) => {
    if (!this.isWeekend(day)) {
      if (this.state.fromDate === null) {
        this.setState({ fromDate: day.timestamp }, () =>
          this.setDateToInput(day.timestamp, "from")
        );
        if (this.props.onChange) {
          this.props.onChange(day.timestamp);
        }
      } else if (this.state.fromDate !== null && this.state.toDate !== null) {
        this.setState(
          { fromDate: day.timestamp, toDate: null },
          () => this.setDateToInput(day.timestamp, "from"),
          this.setDateToInput(null, "to")
        );
        if (this.props.onChange) {
          this.props.onChange(day.timestamp);
        }
      } else if (this.state.fromDate !== null && this.state.toDate === null) {
        if (day.timestamp < this.state.fromDate) {
          let to = this.state.fromDate;
          let from = day.timestamp;
          this.setState({ fromDate: from, toDate: to }, () => {
            this.setDateToInput(to, "to"), this.setDateToInput(from, "from");
          });
          if (this.props.onChange) {
            this.props.onChange(day.timestamp);
          }
        } else {
          this.setState({ toDate: day.timestamp }, () => {
            this.setDateToInput(day.timestamp, "to");
          });
          if (this.props.onChange) {
            this.props.onChange(day.timestamp);
          }
        }
      }
    }
  };

  setYear = (offset) => {
    let year = this.state.year + offset;
    let month = this.state.month;
    let prevYear = this.state.year - 1;
    let prevMonth = month === 0 ? 11 : month - 1;
    this.setState({
      year,
      monthDetails: this.getMonthDetails(year, month),
      prevMonthDetails: this.getMonthDetails(
        month === 0 ? prevYear : year,
        prevMonth
      ),
    });
  };

  setMonth = (offset) => {
    let year = this.state.year;
    let month = this.state.month + offset;
    if (month === -1) {
      month = 11;
      year--;
    } else if (month === 12) {
      month = 0;
      year++;
    }
    let prevYear = this.state.year - 1;
    let prevMonth = month === 0 ? 11 : month - 1;
    this.setState({
      year,
      month,
      monthDetails: this.getMonthDetails(year, month),
      prevMonthDetails: this.getMonthDetails(
        month === 0 ? prevYear : year,
        prevMonth
      ),
    });
  };

  /**
   *  Renderers
   */
  renderFirstMonth() {
    console.log("rendered first month again");
    let days = this.state.prevMonthDetails.map((day, index) => {
      return day.month === 0 ? (
        <div
          className={
            "c-day-container " +
            (day.month === 1 ? "c-hidden" : "") +
            (day.month === -1 ? "disabled" : "") +
            (this.isCurrentDay(day) ? " highlight-grey" : "") +
            (this.isToOrFromDay(day) ? "highlight-green" : "") +
            (this.isInRange(day) ? "highlight-green" : "") +
            (this.isWeekend(day) ? "weekend" : "")
          }
          key={index}
        >
          <div className="cdc-day">
            <span
              onClick={() => this.onDateClick(day)}
              style={
                this.isWeekend(day)
                  ? this.isCurrentDay(day)
                    ? {
                        color: "lightgrey",
                        textDecoration: "line-through",
                        backgroundColor: "grey",
                      }
                    : { color: "lightgrey", textDecoration: "line-through" }
                  : {}
              }
            >
              {day.date}
            </span>
          </div>
        </div>
      ) : (
        <div className={"c-day-container "}>
          <div className="cdc-day">
            <span style={{ visibility: "hidden" }}>{day.date}</span>
          </div>
        </div>
      );
    });
    return (
      <div className="c-container">
        <div className="cc-head">
          {["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"].map((d, i) => (
            <div key={i} className="cch-name">
              {d}
            </div>
          ))}
        </div>
        <div className="cc-body">{days}</div>
      </div>
    );
  }

  selectDaysButtonHandler = (e, numberOfDays) => {
    let to = todayTimestamp;
    let from =
      new Date(Date.now() - numberOfDays * 24 * 60 * 60 * 1000) -
      (Date.now() % oneDay) +
      new Date().getTimezoneOffset() * 1000 * 60;
    this.setState(
      {
        toDate: todayTimestamp,
        fromDate: from,
      },
      () => this.setDateToInput(to, "to"),
      this.setDateToInput(from, "from")
    );
  };

  renderSecondMonth() {
    let days = this.state.monthDetails.map((day, index) => {
      return day.month === 0 ? (
        <div
          className={
            "c-day-container " +
            (day.month === 1 ? "disabled" : "") +
            (day.month === -1 ? "c-hidden" : "") +
            (this.isCurrentDay(day) ? " highlight-grey" : "") +
            (this.isToOrFromDay(day) ? "highlight-green" : "") +
            (this.isInRange(day) ? "highlight-green" : "") +
            (this.isWeekend(day) ? "disabled" : "")
          }
          key={index}
        >
          <div className="cdc-day">
            <span
              onClick={() => this.onDateClick(day)}
              style={
                this.isWeekend(day)
                  ? this.isCurrentDay(day)
                    ? {
                        color: "lightgrey",
                        textDecoration: "line-through",
                        backgroundColor: "grey",
                      }
                    : { color: "lightgrey", textDecoration: "line-through" }
                  : {}
              }
            >
              {day.date}
            </span>
          </div>
        </div>
      ) : (
        <div className={"c-day-container "}>
          <div className="cdc-day">
            <span
              onClick={() => this.onDateClick(day)}
              style={{ visibility: "hidden" }}
            >
              {day.date}
            </span>
          </div>
        </div>
      );
    });

    return (
      <div className="c-container">
        <div className="cc-head">
          {["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"].map((d, i) => (
            <div key={i} className="cch-name">
              {d}
            </div>
          ))}
        </div>
        <div className="cc-body">{days}</div>
      </div>
    );
  }

  handleReset = () => {
    let date = new Date();
    let year = date.getFullYear();
    let month = date.getMonth();
    let prevMonth = month === 0 ? 11 : month - 1;
    let prevYear = year - 1;
    this.setState({
      year,
      month,
      selectedToDay: null,
      selectedFromDay: null,
      today: todayTimestamp,
      toDate: null,
      fromDate: null,
      monthDetails: this.getMonthDetails(year, month),
      prevMonthDetails: this.getMonthDetails(
        month === 0 ? prevYear : year,
        prevMonth
      ),
      weekendsInRange: []
    });
    toInputRef.current.value = null;
    fromInputRef.current.value = null;
  };

  render() {
    return (
      <div>
        <h1><u>Date-Range Picker</u></h1>
        <div className="MyDatePicker">
          <div className="mdp-input-wrapper">
            <div>
              <label className="mdp-input">
                <b>Date Range :</b>
              </label>
              <input
                type="date"
                label="ooo"
                className="mdp-input"
                onChange={this.updateDateFromInput}
                ref={fromInputRef}
                onClick={() => this.showDatePicker(true)}
              />
              <input
                type="date"
                className="mdp-input"
                onChange={this.updateDateFromInput}
                ref={toInputRef}
                onClick={() => this.showDatePicker(true)}
              />
            </div>

            <div className="reset-button" style={{ color: "aliceblue" }}>
              <button onClick={this.handleReset}>Reset</button>
            </div>
          </div>

          <div style={{ marginTop: "20px" }}>
            <label className="mdp-input"> <b>[[Start Date, End Date], [Weekend Dates Array]]:</b> </label>
            <label className="mdp-input"> [[{this.state.fromDate ? this.getDateStringFromTimestamp(this.state.fromDate) : "--"}, 
                                            {this.state.toDate ? this.getDateStringFromTimestamp(this.state.toDate) : "--"}], {JSON.stringify(this.state.weekendsInRange)}]: </label>
          </div>
        </div>

        {this.state.showDatePicker ? (
          <div className="mdp-container">
            <div className="mdpc-head" style={{ marginLeft: "2%" }}>
              <div className="mdpch-button">
                <div className="mdpchb-inner" onClick={() => this.setYear(-1)}>
                  <span className="mdpchbi-left-arrows"></span>
                </div>
              </div>
              <div className="mdpch-button">
                <div className="mdpchb-inner" onClick={() => this.setMonth(-1)}>
                  <span className="mdpchbi-left-arrow"></span>
                </div>
              </div>
              <div className="mdpch-container">
                <div className="mdpchc-year">
                  {this.state.month === 0
                    ? this.state.year - 1
                    : this.state.year}
                </div>
                <div className="mdpchc-month">
                  {this.getMonthStr(
                    this.state.month === 0 ? 11 : this.state.month - 1
                  )}
                </div>
              </div>
              {/* <div className="mdpch-container">
                    <div className='mdpch-dash'>----------------------------</div>
                    </div> */}
              <div
                className="mdpch-container"
                style={{ marginLeft: "30%", float: "right" }}
              >
                <div className="mdpchc-year">{this.state.year}</div>
                <div className="mdpchc-month">
                  {this.getMonthStr(this.state.month)}
                </div>
              </div>
              <div className="mdpch-button" style={{ float: "right" }}>
                <div className="mdpchb-inner" onClick={() => this.setMonth(1)}>
                  <span className="mdpchbi-right-arrow"></span>
                </div>
              </div>
              <div className="mdpch-button" onClick={() => this.setYear(1)}>
                <div className="mdpchb-inner">
                  <span className="mdpchbi-right-arrows"></span>
                </div>
              </div>
            </div>
            <div className="mdpc-body1">{this.renderFirstMonth()}</div>

            <div className="mdpc-body2">{this.renderSecondMonth()}</div>
            <div className=".mdpch-button-btm-wrapper">
              <div
                className="mdpch-button-btm"
                onClick={(e) => {
                  this.selectDaysButtonHandler(e, 6);
                }}
              >
                <button> Select last 7 days </button>{" "}
              </div>
              <div
                className="mdpch-button-btm"
                onClick={(e) => {
                  this.selectDaysButtonHandler(e, 30);
                }}
              >
                <button>Select last 30 days </button>
              </div>
            </div>
          </div>
        ) : (
          ""
        )}
      </div>
    );
  }
}