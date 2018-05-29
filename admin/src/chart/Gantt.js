import React, { Component } from 'react';
import 'dhtmlx-gantt';
// import './dhtmlxgantt.css';
import 'dhtmlx-gantt/codebase/dhtmlxgantt.css';

const gantt = window.gantt;

export default class Gantt extends Component {
  componentDidMount() {

    gantt.config.scale_unit = "month";
    gantt.config.step = 1;
    gantt.config.date_scale = "%F, %Y";
    gantt.config.min_column_width = 100;

    gantt.config.scale_height = 90;
    gantt.config.column_height = 50;

    gantt.config.fit_tasks = true;

    // const weekScaleTemplate = function(date){
    //   var dateToStr = gantt.date.date_to_str("%d %M");
    //   var endDate = gantt.date.add(gantt.date.add(date, 1, "week"), -1, "day");
    //   return '<div style="">' + dateToStr(date) + " - " + dateToStr(endDate) + '</div>';
    // };

    if (this.props.weekly) {
      gantt.config.subscales = [
        {unit:"week", step:1, template: this.weekScaleTemplate},
      ];
    } else {
      gantt.config.subscales = [
        {unit:"week", step:1, template: this.weekScaleTemplate},
        {unit:"day", step:1, date:"%D" }
      ];
    }

    //Weekends Color
    gantt.templates.scale_cell_class = function(date){
    if(date.getDay()==0||date.getDay()==6){
            return "weekend";
        }
    };
    gantt.templates.task_cell_class = function(item,date){
        if(date.getDay()==0||date.getDay()==6){
            return "weekend" ;
        }
    };

    gantt.init(this.ganttContainer);
    gantt.clearAll();
    gantt.parse(this.props.tasks);
  }

  weekScaleTemplate(date) {
    var dateToStr = gantt.date.date_to_str("%d %M");
    var endDate = gantt.date.add(gantt.date.add(date, 1, "week"), -1, "day");
    return '<div style="">' + dateToStr(date) + " - " + dateToStr(endDate) + '</div>';
  }

  componentWillReceiveProps(nextProps) {

    if (this.props.weekly === nextProps.weekly) {
      return;
    }

    try {
      if (nextProps.weekly) {
        gantt.config.subscales = [
          {unit:"week", step:1, template: this.weekScaleTemplate},
        ];
      } else {
        gantt.config.subscales = [
          {unit:"week", step:1, template: this.weekScaleTemplate},
          {unit:"day", step:1, date:"%D" }
        ];
      }

      gantt.clearAll();
      gantt.clearAll();
      gantt.parse(nextProps.tasks);
    } catch (err) {
      console.log(err);
    }
  }

  render() {
    return (
        <div
            ref={(input) => { this.ganttContainer = input }}
            style={{width: '100%', height: '100%'}}
        ></div>
    );
  }
}
