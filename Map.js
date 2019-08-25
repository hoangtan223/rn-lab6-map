import React, { Component } from 'react'
import { Image, Dimensions } from 'react-native'
import MapView, { Marker, Callout } from 'react-native-maps';
import Lightbox from 'react-native-lightbox';
import * as ImagePicker from 'expo-image-picker';
import Constants from 'expo-constants';

export default class Map extends Component {
  constructor(props) {
    super(props)
    this.state = {
      locations: [],
      imageSize: { width: 100, height: 100 },
    }
  }


  componentDidMount() {
    this.getPermissionAsync();
  }

  getPermissionAsync = async () => {
    if (Constants.platform.ios) {
      const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
      if (status !== 'granted') {
        alert('Sorry, we need camera roll permissions to make this work!');
      }
    }
  }

  handleLongPress = async (coordinate) => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [4, 3],
      });

      if (!result.cancelled) {
        let newLocation = {
          longitude: coordinate.longitude,
          latitude: coordinate.latitude,
          image: result.uri
        }

        let newLocations = [...this.state.locations, newLocation]
        console.log(newLocations)
        this.setState({ locations: newLocations })
      }
    } catch (error) {
      console.log(error)
    }
  }

  onOpenLightbox = () => {
    const { width, height } = Dimensions.get('screen');
    this.setState({
      imageSize: {
        width: width,
        height: height
      }
    })
  }

  onCloseLightbox = () => {
    this.setState({
      imageSize: {
        width: 100,
        height: 100
      }
    })
  }

  render() {
    var { coords } = this.props.location

    return (
      <MapView
        style={{flex: 1}}
        initialRegion={{
            longitude: coords.longitude,
            latitude: coords.latitude,
            latitudeDelta: 0.005,
            longitudeDelta: 0.005
          }}
        onLongPress={(e) => this.handleLongPress(e.nativeEvent.coordinate)}
      >
        {
          this.state.locations.map((location, index) => {
            return (
              <Marker
                coordinate={{ longitude: location.longitude, latitude: location.latitude }}
                key={index}
              >
                <Callout>
                  <Lightbox
                    onOpen={this.onOpenLightbox}
                    onClose={this.onCloseLightbox}
                  >
                    <Image style={{ height: this.state.imageSize.height, width: this.state.imageSize.width }} source={{ uri: location.image }} resizeMode="cover" />
                  </Lightbox>
                </Callout>
              </Marker>
            )
          })
        }
      </MapView>
    )
  }
}
