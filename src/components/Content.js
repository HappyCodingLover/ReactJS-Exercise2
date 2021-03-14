import React, {Component} from "react";
import { Button, FormControl, Form, Feedback } from "react-bootstrap";
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';

export default class Content extends Component {
  constructor(props) {
    super(props);

    this.state = {
      number: "",
      numbers: [],
      isInvalid: false,
      isWarning: false,
    };
    this.onAdd = this.onAdd.bind(this)
    this.onEdit = this.onEdit.bind(this)
    this.checkNumber = this.checkNumber.bind(this)
    this.onDragEnd = this.onDragEnd.bind(this)
    this.closeAlert = this.closeAlert.bind(this)
  }

  checkNumber() {
    const {number, numbers} = this.state
    if(number == "" || number.length < 14)
      return 0
    for(let i = 0 ; i < numbers.length ; i ++) {
      if(numbers[i] === number)
        return 1
    }
    return 2
  }

  onAdd(e) {
    e.preventDefault()

    const {number, numbers} = this.state
    const {checkNumber} = this
    let tempArray = numbers, i, length
    if(checkNumber() == 0)
      this.setState({isInvalid: true})
    if(checkNumber() == 1)
      this.setState({isInvalid: true, isWarning: true})
    if(checkNumber() == 2) {
      tempArray.push(number)
      length = tempArray.length
      if(length > 1) {
        for(i = length - 1 ; i >= 1 ; i -- )
        tempArray[i] = tempArray[i - 1]
        tempArray[0] = number
      }
      this.setState({
        number: "",
        numbers: tempArray,
        isInvalid: false,
        isWarning: false
      })
    }
    else
      this.setState({isInvalid: true})
  }

  onEdit(e) {
    let value = e.target.value, i
    const {number} = this.state
    if(value.length < number.length) {
      this.setState({ number: value })
    }
    else if(value[value.length - 1] >= '0' && value[value.length - 1] <= '9') {
      switch(value.length) {
        case 1:
          value = '(' + value
          break;
        case 4:
          value = value + ') '
          break;
        case 9:
          value = value + '-'
          break;
        case 5:
          value = number + ') ' + value[4]
          break;
        case 10:
          value = number + '-' + value[9]
          break;
      }
      if(value.length < 15 )
        this.setState({ number: value })
    }
  }

  onDragEnd(result) {
    const {numbers} = this.state
    if(numbers.length > 1 && result.source != null && result.destination != null) {
      const start = result.source.index
      const end = result.destination.index
      let tempArray = numbers, i, temp
      
      if(start < end) {
        temp = tempArray[start]
        for(i = start + 1 ; i <= end ; i ++)
          tempArray[i - 1] = tempArray[i]
        tempArray[end] = temp
      }
      else {
        temp = tempArray[start]
        for(i = start ; i > end ; i --)
          tempArray[i] = tempArray[i - 1]
        tempArray[end] = temp
      }
      this.setState({numbers: tempArray})
    }
  }

  closeAlert() {
    this.setState({isWarning: false})
  }

  render() {
    const {number, numbers, isInvalid, isWarning} = this.state
    const {onEdit, onAdd, onDragEnd, closeAlert} = this
    return (
      <>
        <Form className="form-inline mt-3" onSubmit={onAdd}>
          <FormControl
            type="text"
            value={number}
            onChange={e => onEdit(e)}
            isInvalid={isInvalid}
            placeholder="Input Phone Number"/>
          <Button type="submit" className="ml-2"> Add </Button>
        </Form>
        {isWarning && 
          <div className="alert alert-danger mt-3">
            <a href="#" className="close" data-dismiss="alert" aria-label="close" onClick={closeAlert}>&times;</a>
            <strong>Warning!</strong> There is a same phone number
          </div>
        }        
        <div className="list-group mt-3">
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="numbers" type="PhoneNumber">
              {(provided, snapshot) => {
                return (
                  <div ref={provided.innerRef} {...provided.droppableProps}>
                    {numbers.map((item, index) => {
                      return (
                        <Draggable key={item} draggableId={item} index={index}>
                          {(provided, snapshot) => {
                            return (
                              <div
                                className={`phone-number-list-item d-flex justify-content-between
                                  bg-secondary text-white mb-1 px-2 py-1`}
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                              >
                                <span>{item}</span>
                              </div>
                            );
                          }}
                        </Draggable>
                      );
                    })}
                    {provided.placeholder}
                  </div>
                );
              }}
            </Droppable>
          </DragDropContext>
        </div>
      </>
    );
  }
}
