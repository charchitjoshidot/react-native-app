import React, {useState} from "react";
import { Text, StyleSheet, View, FlatList, TextInput, ActivityIndicator, Image, Dimensions, Button} from 'react-native';
import { Dropdown } from 'react-native-material-dropdown';
import { black } from "color-name";

const data = [
  { key: 'A' }, { key: 'B' }, { key: 'C' }, { key: 'D' }, { key: 'E' }, { key: 'F' }, { key: 'G' }, { key: 'H' }, { key: 'I' }, { key: 'J' }
];

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
      arrayHolder : []
    };
    this.updateSearchQuery = this.updateSearchQuery.bind(this);
    this.onChangeDropDownValue = this.onChangeDropDownValue.bind(this);
    this.onClickSearchButton = this.onClickSearchButton.bind(this);
  }

  componentDidMount() {
    const settings = {
      "async": true,
      "crossDomain": true,
      "url": "https://www.flickr.com/services/rest/?method=flickr.photos.search&api_key=28d845f29cf1d71a2b89123de6be3448&tags=chicago&format=json&nojsoncallback=1&auth_token=72157714101339551-8f3b1161af2305d6&api_sig=24f4be344fe983844977ebd2d2732fa5",
      "method": "POST",
      "headers": {}
    }

    return fetch(settings)
      .then(response => {
        console.log(response);
      })
  }
  
  updateSearchQuery(text) {
    this.setState({ searchQuery : text})
  }

  onChangeDropDownValue(value) {
    this.setState({numColumns: value})
  }

  onClickSearchButton() {
    //to do search using flicker api
    this.setState({buttonClicked: true})
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

  renderImageSection() {
    return (
      <View style={{backgroundColor: "#ffc0cb", margin: 10, alignItems: "center", justifyContent: 'center'}} >
        <Text>Image Here</Text>
      </View>
    )
  }

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
          <View style={{ flex: 1 }}>
            {/* <Dropdown
              label='Number of Columns'
              value={this.state.numColumns}
              onChangeText={this.onChangeDropDownValue}
              data={this.dropDownData}
            /> */}
          </View>
          <View style={{ width: "50%", marginLeft: 8, marginTop: 25 }}>
            <Button
              onPress={this.onClickSearchButton}
              title="Search on Flickr"
            />
          </View>
        </View>
        <View>
          <Text>This is text field value : {this.state.searchQuery}</Text>
          <Text>This is drop down field value : {this.state.numColumns} </Text>
          <Text>This is button clicked event : {this.state.buttonClicked} </Text>
        </View>
        <View>
          <FlatList
            data={this.formatData(data, this.state.numColumns)}
            style={{ backgroundColor: "#d1d1d1", height: 550 }}
            ItemSeparatorComponent={this.renderSeparator}
            renderItem={this.renderImageSection}
            enableEmptySections={true}
            numColumns={this.state.numColumns}
            keyExtractor={(item, index) => index.toString()}
          />
        </View>
      </View>
    );
  }
}