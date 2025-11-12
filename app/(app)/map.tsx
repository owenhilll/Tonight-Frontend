import useAuth from '../../Hooks/authContext';

import { Image, Platform, Text, TouchableOpacity, View } from 'react-native';
import { useEffect, useRef, useState } from 'react';
import { request } from '../../utils/axios';

import { FontAwesome, FontAwesome6 } from '@expo/vector-icons';
import MapView, { Callout, Marker } from 'react-native-maps';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import Collapsible from 'react-native-collapsible';
export default function Map() {
  const { latitude, longitude, user, token } = useAuth();
  const [data, setData] = useState<any[]>([]);
  const [key, setKey] = useState(0);
  const queryClient = useQueryClient();

  const mapStyle = [
    {
      elementType: 'geometry',
      stylers: [
        {
          color: '#242f3e',
        },
      ],
    },
    {
      elementType: 'labels.text.fill',
      stylers: [
        {
          color: '#746855',
        },
      ],
    },
    {
      elementType: 'labels.text.stroke',
      stylers: [
        {
          color: '#242f3e',
        },
      ],
    },
    {
      featureType: 'administrative.locality',
      elementType: 'labels.text.fill',
      stylers: [
        {
          color: '#d59563',
        },
      ],
    },
    {
      featureType: 'administrative.neighborhood',
      stylers: [
        {
          visibility: 'off',
        },
      ],
    },
    {
      featureType: 'poi',
      stylers: [
        {
          visibility: 'off',
        },
      ],
    },
    {
      featureType: 'poi',
      elementType: 'labels.text.fill',
      stylers: [
        {
          color: '#d59563',
        },
      ],
    },
    {
      featureType: 'poi.park',
      elementType: 'geometry',
      stylers: [
        {
          color: '#263c3f',
        },
      ],
    },
    {
      featureType: 'poi.park',
      elementType: 'labels.text.fill',
      stylers: [
        {
          color: '#6b9a76',
        },
      ],
    },
    {
      featureType: 'road',
      elementType: 'geometry',
      stylers: [
        {
          color: '#38414e',
        },
      ],
    },
    {
      featureType: 'road',
      elementType: 'geometry.stroke',
      stylers: [
        {
          color: '#212a37',
        },
      ],
    },
    {
      featureType: 'road',
      elementType: 'labels.text.fill',
      stylers: [
        {
          color: '#9ca5b3',
        },
      ],
    },
    {
      featureType: 'road.highway',
      elementType: 'geometry',
      stylers: [
        {
          color: '#746855',
        },
      ],
    },
    {
      featureType: 'road.highway',
      elementType: 'geometry.stroke',
      stylers: [
        {
          color: '#1f2835',
        },
      ],
    },
    {
      featureType: 'road.highway',
      elementType: 'labels.text.fill',
      stylers: [
        {
          color: '#f3d19c',
        },
      ],
    },
    {
      featureType: 'transit',
      elementType: 'geometry',
      stylers: [
        {
          color: '#2f3948',
        },
      ],
    },
    {
      featureType: 'transit.station',
      elementType: 'labels.text.fill',
      stylers: [
        {
          color: '#d59563',
        },
      ],
    },
    {
      featureType: 'water',
      elementType: 'geometry',
      stylers: [
        {
          color: '#17263c',
        },
      ],
    },
    {
      featureType: 'water',
      elementType: 'labels.text.fill',
      stylers: [
        {
          color: '#515c6d',
        },
      ],
    },
    {
      featureType: 'water',
      elementType: 'labels.text.stroke',
      stylers: [
        {
          color: '#17263c',
        },
      ],
    },
  ];
  useEffect(() => {
    request
      .get('/events/near?' + 'radius=' + 10, {
        params: {
          y: latitude,
          x: longitude,
        },
        headers: {
          Authorization: token,
        },
      })
      .then(async (res) => {
        let tmpdata: any[] = [];
        const promises = res.data.map(async (val: any) => {
          await request
            .get(`/businesses/find/${val['businessid']}`, {
              headers: {
                Authorization: token,
              },
            })
            .then(async (res) => {
              let pic = await request
                .get(`/businesses/profilepic?id=${val['businessid']}&fetchtype=getObject`, {
                  headers: {
                    Authorization: token,
                  },
                })
                .then((json) => {
                  return json.data;
                });

              tmpdata.push({
                coords: res.data.coordinates,
                label: val.title,
                desc: val.desc,
                category: val.category,
                address: res.data.address,
                profilepic: pic,
                eventid: val.id,
                businessid: res.data.id,
              });
            });
        });

        const final = await Promise.all(promises);
        setData(tmpdata);
        setKey(key + 1);
      })
      .catch((err) => {
        console.error('Failed to fetch Map Data');
      });
  }, []);

  const bookmarkItem = async (eventid: number, businessid: number) => {
    const userid = user?.user.id;

    await request
      .post(
        '/bookmarks/add',
        {
          eventid,
          businessid,
          userid,
        },
        {
          headers: {
            Authorization: token,
          },
        }
      )
      .then((res) => {
        queryClient.invalidateQueries({
          queryKey: ['bookmarks'],
        });
        queryClient.invalidateQueries({
          queryKey: ['bookmarks' + user?.user.id],
        });
      })
      .catch((err) => {});
  };

  const removeBookmark = async (eventid: number) => {
    const userid = user?.user.id;

    await request
      .delete('/bookmarks/delete?userid=' + userid + '&eventid=' + eventid, {
        headers: {
          Authorization: token,
        },
      })
      .then((res) => {
        queryClient.invalidateQueries({
          queryKey: ['bookmarks'],
        });
        queryClient.invalidateQueries({
          queryKey: ['bookmarks' + user?.user.id],
        });
      })
      .catch((err) => {});
  };

  const {
    isLoading: bookmarkedLoading,
    error: bookmarkedError,
    data: bookmarks,
  } = useQuery({
    queryKey: ['bookmarks'],
    queryFn: () =>
      request
        .get('/bookmarks/get?userid=' + user?.user.id, {
          headers: {
            Authorization: token,
          },
        })
        .then((res) => {
          return res.data;
        })
        .catch((err) => {
          console.error('Failed to get Bookmarks');
        }),
  });
  const [legendCollapsed, setLegendCollapsed] = useState(true);
  return (
    <View className="relative flex-1">
      <TouchableOpacity
        onPress={() => setLegendCollapsed(!legendCollapsed)}
        className="absolute left-3 top-5 z-50 rounded-lg bg-[#00E0FF] px-4 py-2">
        <View className="flex-row items-center">
          <Text className="z-50 mr-2 text-center text-2xl ">Legend</Text>
          <FontAwesome6
            name="caret-down"
            classname="mr-5"
            size={15}
            iconstyle="solid"
            color="black"
          />
        </View>
      </TouchableOpacity>
      <View className="absolute left-3 top-16 z-50">
        <Collapsible collapsed={legendCollapsed}>
          <View
            style={{ flexDirection: Platform.OS == 'web' ? 'column' : 'row', flexWrap: 'wrap' }}
            className="rounded-lg border-2 border-white bg-[#38414e] p-2 shadow-lg">
            <View className="my-1 flex-row items-center">
              <FontAwesome6 name="location-dot" size={30} color="#0000CC" />
              <Text className="mx-4 text-xl text-gray-300 ">Drinks</Text>
            </View>
            <View className="my-1 flex-row items-center">
              <FontAwesome6 name="location-dot" size={30} color="#ff8000" />
              <Text className="mx-4 text-xl text-gray-300 ">Food</Text>
            </View>
            <View className="my-1 flex-row items-center">
              <FontAwesome6 name="location-dot" size={30} color="#ff0000" />
              <Text className="mx-4 text-xl text-gray-300 ">Show</Text>
            </View>
            <View className="my-1 flex-row items-center">
              <FontAwesome6 name="location-dot" size={30} color="#6600cc" />
              <Text className="mx-4 text-xl text-gray-300 ">Shop</Text>
            </View>
            <View className="my-1 flex-row items-center">
              <FontAwesome6 name="location-dot" size={30} color="#009900" />
              <Text className="mx-4 text-xl text-gray-300 ">Sports</Text>
            </View>
            <View className="my-1 flex-row items-center">
              <FontAwesome6 name="location-dot" size={30} color="#009999" />
              <Text className="mx-4 text-xl text-gray-300 ">Games</Text>
            </View>
            <View className="my-1 flex-row items-center">
              <FontAwesome6 name="location-dot" size={30} color="#66ffb2" />
              <Text className="mx-4 text-xl text-gray-300 ">Music</Text>
            </View>
            <View className="my-1 flex-row items-center">
              <FontAwesome6 name="location-dot" size={30} color="#999900" />
              <Text className="mx-4 text-xl text-gray-300">Outdoor Activity</Text>
            </View>
            <Text className="text-s my-1 text-white" numberOfLines={2}>
              Clink pin to get more information
            </Text>
          </View>
        </Collapsible>
      </View>
      <MapView
        provider="google"
        style={{ flex: 1 }}
        googleMapsApiKey={'AIzaSyCdlWWT4orEFXd1APChCUCuAPNa9kuOihE'}
        customMapStyle={mapStyle}
        minZoomLevel={13}
        maxZoomLevel={17}
        options={{
          disableDefaultUI: true,
        }}
        initialRegion={{
          latitude: latitude,
          longitude: longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}>
        {data.map((val, index) => {
          return (
            <Marker
              description={val.desc}
              title={val.label}
              key={index}
              className="overflow-visible"
              coordinate={{
                latitude: val['coords']['y'],
                longitude: val['coords']['x'],
              }}>
              <View className="w-30 h-30 cursor-pointer">
                <FontAwesome6
                  name="location-dot"
                  size={30}
                  color={
                    val.category == 'Drink'
                      ? '#0000CC'
                      : val.category == 'Food'
                        ? '#FF8000'
                        : val.category == 'Show'
                          ? '#FF0000'
                          : val.category == 'Shop'
                            ? '#6600CC'
                            : val.category == 'Sport'
                              ? '#009900'
                              : val.category == 'Game'
                                ? '#009999'
                                : val.category == 'Music'
                                  ? '#999900'
                                  : val.category == 'outActivity'
                                    ? '#999900'
                                    : val.category == 'Classes'
                                      ? '#9999FF'
                                      : 'black'
                  }
                />
              </View>
              <Callout className="flex-1 " style={{ padding: 0 }}>
                <View className="flex-row">
                  <View className="flex-1">
                    <Image
                      style={{ width: 45, height: 45, margin: 0, zIndex: 999, padding: 0 }}
                      className="z-50 h-auto w-auto"
                      resizeMode="center"
                      source={{
                        uri: val.profilepic,
                      }}
                    />
                  </View>
                  {!user?.business && !user?.guest && (
                    <View className="mr-1 flex-row">
                      <TouchableOpacity
                        onPress={() =>
                          bookmarks?.some((e: any) => e.eventid == val.eventid)
                            ? removeBookmark(val.eventid)
                            : bookmarkItem(val.eventid, val.businessid)
                        }>
                        <FontAwesome
                          name="bookmark"
                          size={20}
                          color={
                            bookmarks?.some((e: any) => e.eventid == val.eventid) ? 'blue' : 'gray'
                          }
                        />
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
                <View>
                  <Text className="text-xl font-bold">{val.label}</Text>
                  <View className="flex-row">
                    <FontAwesome6 name="circle-info" size={17} />
                    <Text className="ml-2">{val.desc}</Text>
                  </View>
                  <View className="ml-1 mt-2 flex-row">
                    <FontAwesome6 name="map-pin" size={20} />
                    <Text className="ml-2">{val.address}</Text>
                  </View>
                </View>
              </Callout>
            </Marker>
          );
        })}
      </MapView>
    </View>
  );
}
