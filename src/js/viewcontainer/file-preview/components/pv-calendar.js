import React from 'react'
import classnames from 'classnames'
import Utils from '../utils'
import Calendar from 'calendar'

export class PreviewCalendar extends React.Component{
  
  constructor(props) {
    super(props)
  }
  
 render() {
    let now = new Date()
    let calendar = new Calendar.Calendar(1) // 1: weeks starts on Monday
    let month = calendar.monthDays(this.props.date.getFullYear(), this.props.date.getMonth())
    let checkDay = (
      now.getFullYear() == this.props.date.getFullYear() 
      && 
      now.getMonth() == this.props.date.getMonth()
    )
    
    let weekRows = []
    month.map((week, weekIndex) => {
      weekRows[weekIndex] = week.map((day, index) => {
        
        let classes = classnames({
          'hidden': (day < 1),
          'day-point': (day == this.props.date.getDate()),
          'today': (checkDay && now.getDate() == day)
        })
        return <td key={index} className={classes}>{day}</td>
      })
    })
    
    return (
      <table className="Calendar">
        <thead>
          <tr>
            <td>Mon</td>
            <td>Thu</td>
            <td>Whe</td>
            <td>Thr</td>
            <td>Frd</td>
            <td>Sat</td>
            <td>Sun</td>
          </tr>
        </thead>
        <tbody>
          {month.map((week, weekIndex) => {
            return (
              <tr key={weekIndex}>
                {weekRows[weekIndex]}
              </tr>
            );
          })}
        </tbody>
      </table>
    )
  }
}
