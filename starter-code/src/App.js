import React, { Component } from 'react';
import foods from './foods.json'
import FoodBox from './components/FoodBox';
import FoodItem from './components/FoodItem';
import 'bulma/css/bulma.css';
import './App.css'
import Form from './components/Form';

class App extends Component {
  state={
    foodsList: foods,
    selectedFood: [],
    amountOfCalories: 0,
    inputSearch: "",
    formIsActive: true
  }

  handleChangeServes = (index, numOfServes) =>{
    const clonedFoodsList = this.state.foodsList

    clonedFoodsList[index].quantity = parseInt(numOfServes)
    this.setState({
      foodlist : clonedFoodsList
    })
  }

  useThisFood = (index, numOfServes) =>{
    console.log(`${index} -> ${numOfServes}`);
    let sumOfCalories = 0
    const selectedFoodForDay = this.state.selectedFood
    const isDuplicate = selectedFoodForDay.some((element) => {
      return this.state.foodsList[index].name===element.name
    })
    const selectedItem =this.state.foodsList[index]

    selectedItem.quantity+= parseInt(numOfServes)
    if(!isDuplicate){
      selectedFoodForDay.push(selectedItem)-1
    }

    selectedFoodForDay.forEach((element) => {
      return sumOfCalories+= parseInt(element.calories)*parseInt(element.quantity)
    })
    this.setState({selectedFood: selectedFoodForDay})
    this.setState({amountOfCalories: sumOfCalories})
  }

  deleteThisFood = (index) => {
    const selectedFoodForDay=this.state.selectedFood
    const deleted=selectedFoodForDay.splice(index,1)

    this.setState({selectedFood: selectedFoodForDay})
    this.setState({amountOfCalories: this.state.amountOfCalories-deleted[0].calories*deleted[0].quantity})
  }

  newFood = (element) => {
    console.log(element)
    console.log(element.name && element.calories && element.image);
    if(element.name && element.calories && element.image) {
      const clonedFoodsList = this.state.foodsList
      clonedFoodsList.unshift(element)
      this.setState({foodsList:clonedFoodsList})
      console.log('ok');
    }
    this.handleActiveForm()
  }

  handleInput = (e) => {
    this.setState({
      inputSearch: e.target.value,
    })
  }

  handleActiveForm = () => {
    this.setState({formIsActive: !this.state.formIsActive})
  }

  render() {
    return (
    <div className="container">
      <h1 className="title">IronNutrition</h1>
      <div>
        <input type="text" className="input search-bar" name="search" placeholder="Search" value={this.state.search} onChange={this.handleInput}/>
        <button className="button is-link is-outlined margin" onClick={this.handleActiveForm}>{ this.state.formIsActive? 'new food':'hide' }</button>
        { !this.state.formIsActive? <Form onSubmit={(element)=>this.newFood(element)}/>:"" }
      </div>
      <div className="columns">
        <div className="column">
          {
            this.state.foodsList.map((element, index)=>{
              if(element.name.includes(this.state.inputSearch)){
                return <FoodBox key={index} id={index} {...element}
                        onSelectFood={(index, numOfServes, oldNumOfServes)=>{
                          this.useThisFood(index, numOfServes, oldNumOfServes)
                        }
                      }/>
              }
            })
          }
        </div>
        <div className="column content">
          <h2 className="subtitle">Today's foods</h2>
          <ul>
          {
            this.state.selectedFood.map((element,index)=>{
              return <FoodItem key={index} id={index} {...element} onClick={e=>this.deleteThisFood(index)}/>
            })
          } </ul>
          <strong>Total: {parseInt(this.state.amountOfCalories).toLocaleString()} cal</strong>
        </div>
      </div>
    </div>
    );
  }
}

export default App;
