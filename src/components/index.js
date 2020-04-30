import React, {useState} from "react";
import { Text, StyleSheet, View, FlatList, TextInput, ActivityIndicator, Image, Dimensions, TouchableHighlight} from 'react-native';
import { Dropdown } from 'react-native-material-dropdown';
import { searchPhotos } from "../helpers/FlickrAPI";

export default class HomeScreen extends React.Component{

  styles = StyleSheet.create({
    viewStyle: {
      marginTop: 10,
      padding: 16,
    },
    textInputStyle: {
      height: 35,
      borderWidth: 1,
      paddingLeft: 10,
      borderColor: '#009688',
      backgroundColor: '#FFFFFF',
    },
    button: {
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#0078D4',
      height: 30
    },
    buttonText: {
      color: 'white',
      fontSize: 18 
    }
  })

  dropDownData = [
    { value: "1" },
    { value: "2" },
    { value: "3" },
    { value: "4" },
    { value: "5" }
  ];

  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      searchQuery: 'chicago',
      numColumns: "2",
      buttonClicked: false,
      photos : []
    };
    this.updateSearchQuery = this.updateSearchQuery.bind(this);
    this.onChangeDropDownValue = this.onChangeDropDownValue.bind(this);
    this.onClickSearchButton = this.onClickSearchButton.bind(this);
  }

  componentDidMount() {
    searchPhotos(this.state.searchQuery)
    .then(response => {
      console.log('there are ' + response.length+ ' photos in the result');
      this.setState({
        photos: response
      })
    })
  }
  
  updateSearchQuery(text) {
    this.setState({ searchQuery : text})
  }

  onChangeDropDownValue(value) {
    this.setState({numColumns: value})
  }

  onClickSearchButton() {
    if(this.state.searchQuery){
      this.setState({isLoading: true});
      searchPhotos(this.state.searchQuery)
        .then(response => {
          if(response.length) {
            console.log('there are ' + response.length + ' photos in the result');
            this.setState({
              photos: response,
              isLoading: false
            })
          }
        })
    }
  }

  renderSeparator() {
    return (
      <View
        style={{
          height: 1,
          width: "100%",
          backgroundColor: "#CED0CE",
          marginLeft: "5%",
          marginRight: "5%"
        }}
      />
    );
  };

  formatData(data, numColumns) {
    const numberOfFullRows = Math.floor(data.length / numColumns);

    let numberOfElementsLastRow = data.length - (numberOfFullRows * numColumns);
    while (numberOfElementsLastRow !== numColumns && numberOfElementsLastRow !== 0) {
      data.push({ key: `blank-${numberOfElementsLastRow}`, empty: true });
      numberOfElementsLastRow++;
    }
    return data;
  };

  render() {
    if (this.state.isLoading) {
      //Loading View while data is loading
      return (
        <View style={{ flex: 1, paddingTop: 20}}>
          <ActivityIndicator />
        </View>
      );
    }

    return (
      //ListView to show with textinput used as search bar
      <View style={this.styles.viewStyle}>
        <TextInput
          style={this.styles.textInputStyle}
          underlineColorAndroid="transparent"
          placeholder="Search Here"
          value={this.state.searchQuery}
          onChangeText={this.updateSearchQuery}
        />
        <View style={{ flexDirection: 'row' }}>
          <View style={{flex: 1}}>
            <Dropdown
              label='Number of Columns'
              value={this.state.numColumns}
              onChangeText={this.onChangeDropDownValue}
              data={this.dropDownData}
            />
          </View>
          <View style={{ width: "50%", marginLeft: 8, marginTop: 25 }}>
            <TouchableHighlight
              style={this.styles.button}
              underlayColor='white'
              onPress={() => this.onClickSearchButton()}
            >
              <View>
                <Text style={this.styles.buttonText}>Search on Flickr</Text>
              </View>
            </TouchableHighlight>
          </View>
        </View>
        <View>
          <Text>This is text field value : {this.state.searchQuery}</Text>
          <Text>This is drop down field value : {this.state.numColumns} </Text>
          <Text>This is button clicked event : {this.state.buttonClicked} </Text>
          <Text>Total Number of Photos : {this.state.photos.length} </Text>
        </View>
        <View>
          <FlatList
            data={this.formatData(this.state.photos, this.state.numColumns)}
            style={{ backgroundColor: "#d1d1d1", height: 550 }}
            ItemSeparatorComponent={this.renderSeparator}
            renderItem={({item}) => <View>
              <Image
                style={{width: 100, height: 100}}
                source={{ uri: item.url_m }}
              />
            </View> }
            enableEmptySections={true}
            numColumns={this.state.numColumns}
            keyExtractor={(item, index) => index.toString()}
          />
        </View>
      </View>
    );
  }
}