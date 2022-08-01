import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { StyleSheet, View, Button, TouchableOpacity, Text, ScrollView, TouchableNativeFeedback, Image, Modal, Pressable, StatusBar, Platform, TouchableWithoutFeedback, FlatList, Alert } from 'react-native';
import COLORS from '../../conts/colors';
import { SafeAreaView } from 'react-native-safe-area-context';
import Input from '../components/Input';
import PersonFill from 'react-native-bootstrap-icons/icons/person-fill';
import ImagePicker from 'react-native-image-crop-picker';
import { TextInput } from 'react-native-gesture-handler';
import { faXmark } from '@fortawesome/free-solid-svg-icons/faXmark'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { IRootState } from '../../redux/state';
import { useDispatch, useSelector } from 'react-redux';
import { createUserProfile, updateUserProfile } from '../../redux/userInfo/thunks';
import Toast from 'react-native-toast-message';
//import { stat } from 'react-native-fs';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';

// import { UserInfo } from ;
const emptyObject = {
  first_name: "", last_name: "", title: "", company_name: "",
  tel: "", email: "", address: "", website: "", description: "", imgSrc: ""
}
const CardCreate = (props: any) => {
  //   {"navigation": 
  //     {"addListener": [Function addListener], 
  //     "canGoBack": [Function canGoBack], 
  //     "dispatch": [Function dispatch], 
  //     "getId": [Function getId], "getParent": [Function getParent], 
  //     "getState": [Function anonymous], "goBack": [Function anonymous], 
  //     "isFocused": [Function isFocused], "navigate": [Function anonymous], 
  //     "pop": [Function anonymous], "popToTop": [Function anonymous], "push": [Function anonymous], 
  //     "removeListener": [Function removeListener], "replace": [Function anonymous], "reset": [Function anonymous], 
  //     "setOptions": [Function setOptions], "setParams": [Function anonymous]}, 
  //   "route": {"key": "CardCreate-Ht7ZqSwuTx45fHtBB8PQE", "name": "CardCreate", "params": {"address": "10 Chater Road
  //  Central, Hong Kong", "company_name": "KPMG Advisory (Hong Kong) Limited", "email": "wiki.ng@kpmg.com", "first_name": "Wiki", "last_name": "Ng", "tel": [Array], "title": "Consultant"}, "path": undefined}}

  //console.log("Param get: ", props.route.params);
  //const dispatch = useDispatch()
  const [disable, setDisable] = useState(false)
  const [telephone, setTelephone] = useState([{ id: 0, category: "Work", telephone: "", topHeight: 146 + 50 * 5 + 26, dy: 0 }])
  //const { email, name, userId, title, telephones, company, address, website, imageFormat, imageBg, cardImage, defaultImageIndex, description, profilePic, cardId, firstName, lastName, } = useSelector((state: IRootState) => state.userInfo);
  //const telephones = props.route.params.tel
  const topHeight = useRef(146 + 50 * 5 + 26)
  const id = useRef(0)
  const { firstName, lastName, email } = useSelector((state: IRootState) => state.userInfo);
  //console.log({ firstName, lastName, email })
  const descriptionInput0 = useRef<any>()
  const descriptionInput1 = useRef<any>()
  const descriptionInput2 = useRef<any>()
  const yDiff = useRef<number>(0)

  const [inputs, setInputs] = useState(props.route.params ? {
    ...props.route.params, website: "", description: "", has_acct: false
  } : {
    first_name: "", last_name: "", title: "", company_name: "",
    tel: "", email: "", address: "", website: "", description: "", imgSrc: ""
  });
  const [errors, setErrors] = useState({
    first_name: "", last_name: "", title: "", company_name: "",
    tel: "", email: "", address: "", website: "", description: ""
  });
  const [descriptionRow, setDescriptionRow] = useState({ 0: "", 1: "", 2: "", })
  const [iconSrc, setIconSrc] = useState<{ uri: string } | null>(null);

  //console.log("telephone from params: ", inputs.tel)
  useLayoutEffect(() => {
    props.navigation.setOptions({
      headerRight: () => (
        <Pressable style={styles.button} onPress={() => showCancelWarning()}>
          <Text style={styles.buttonText}>Cancel</Text>
        </Pressable>
      ),
      headerLeft: () => (
        <TouchableOpacity onPress={() => { showCancelWarning() }}>
          <View style={{ marginRight: 16,paddingHorizontal: 10}}>
            <FontAwesomeIcon icon={faArrowLeft} style={{ color: COLORS.black}} size={20} />
          </View>
        </TouchableOpacity>),
    });
  }, [props.navigation]);

  const showCancelWarning = () => {
    Alert.alert(
      "Cancel?",
      "Are you sure to leave this page?",
      [
        {
          text: "No",
          style: "cancel"
        },
        { text: "Yes", onPress: () => props.navigation.navigate("Footer") } //props.navigation.goBack()
      ]
    );

  }

  useEffect(() => {
    if (inputs.tel.length > 0) {
      let newTel = [...telephone]
      newTel[0]["category"] = `${inputs.tel[0].category}`
      newTel[0]["telephone"] = `${inputs.tel[0].tel_number}`
    }
    if (inputs.tel.length > 1) {
      for (let i = 1; i < inputs.tel.length; i++) {
        topHeight.current = topHeight.current + 45
        id.current = id.current + 1
        console.log(i + " tel no: " + inputs.tel[i].tel_number)
        setTelephone(previousState => [...previousState, { id: id.current, category: inputs.tel[i].category, telephone: `${inputs.tel[i].tel_number}`, topHeight: topHeight.current, dy: 0 }])
      }
    }
  }, [])

  const addTelephones = () => {
    topHeight.current = topHeight.current + 45
    id.current = id.current + 1
    setTelephone(previousState => [...previousState, { id: id.current, category: "Work", telephone: "", topHeight: topHeight.current, dy: yDiff.current }])
  }

  const deleteTelephones = (index: number) => {
    topHeight.current = topHeight.current - 45
    let telCopy = [...telephone]
    telCopy.map(telephone => { if (telephone.id > index) telephone.topHeight = telephone.topHeight - 45 })  //adjust position height
    let remaining = telCopy.filter(telephone => telephone.id != index)
    setTelephone(remaining)
  }

  const clearInput = (item) => {
    setInputs(prevState => ({ ...prevState, [item]: "" }));
  }

  const getIcon = async () => {
    try {
      const image = await ImagePicker.openPicker({
        width: 60,
        height: 60,
        cropping: true,
        cropperCircleOverlay: true
      });
      console.log("picker set: ", image.path)
      setIconSrc({ uri: image.path });
      //console.log("image set: ", iconSrc)
    } catch (err: any) {
      if (err.message !== 'User cancelled image selection') {
        console.error(err);
      }
    }
  };

  const checkInput = async () => {
    setDisable(true)
    try {
      let validName = /^[a-zA-Z]+$/
      let validEmail = /\s*\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+\s*/
      let error = 0;
      setErrors({
        first_name: "", last_name: "", title: "", company_name: "",
        tel: "", email: "", address: "", website: "", description: ""
      })
      // if (inputs.password.length < 5) {
      //   setErrors(prevState => ({ ...prevState, ["password"]: 'Password has to be at least 5 character long.' }));
      //   error += 1;
      // }
      if (!inputs.first_name.match(validName)) { //check empty?
        setErrors(prevState => ({ ...prevState, ["first_name"]: 'invalid first name' }));
        error += 1;
      }
      if (!inputs.last_name.match(validName)) {
        setErrors(prevState => ({ ...prevState, ["last_name"]: 'invalid last name' }));
        error += 1;
      }
      if (!inputs.title.match(validName)) {
        setErrors(prevState => ({ ...prevState, ["title"]: 'invalid title' }));
        error += 1;
      }
      if (!inputs.company_name.match(validName)) {
        setErrors(prevState => ({ ...prevState, ["company_name"]: 'invalid company name' }));
        error += 1;
      }
      //invalid phone
      // if (!inputs.company_name.match(validName)) {
      //   setErrors(prevState => ({ ...prevState, ["company_name"]: 'invalid company name' }));
      //   error += 1;
      // }
      if (!inputs.email.match(validEmail)) {
        setErrors(prevState => ({ ...prevState, ["email"]: 'invalid email' }));
        error += 1;
      }
      if (error > 0) {
        setDisable(false)
        return
      }
      submit()
    } catch (e) {
      console.log(e)
      setDisable(false)
    }
  }

  const handleOnchange = (options: { text: string, input: string }) => {
    const { text, input } = options
    setInputs(prevState => ({ ...prevState, [input]: text }));
  };

  //change telephone number
  const handleTelephoneOnchange = (options: { tel: string, index: number }) => {
    const { tel, index } = options
    let newTel = [...telephone]
    newTel.map(telephone => { if (telephone.id == index) telephone.telephone = tel })
    setTelephone(newTel);
  }

  //change phone categories
  const handleCategoryOnchange = (options: { category: string, index: number }) => {
    const { category, index } = options
    let newTel = [...telephone]
    newTel.map(telephone => { if (telephone.id == index) telephone.category = category })
    setTelephone(newTel);
  }

  //Due to scroll
  const changeDropdownPositions = (dy: number) => {
    let newTel = [...telephone]
    yDiff.current = dy
    newTel.map(telephone => { telephone.dy = dy })
    setTelephone(newTel);
  }

  const handleDescriptionOnChange = (options: { text: string, input: number }) => {
    const { text, input } = options
    setDescriptionRow(prevState => ({ ...prevState, [input]: text }));
    let descriptionValue: string;
    descriptionValue = descriptionRow[0] + "\n" + descriptionRow[1] + "\n" + descriptionRow[2]
    setInputs(prevState => ({ ...prevState, ["description"]: descriptionValue }));
    console.log("try:" + descriptionValue)

    if (text.length == 37) {
      if (input == 0 && descriptionInput0.current) {
        descriptionInput1.current.focus()
      }
      if (input == 1 && descriptionInput1.current) {
        descriptionInput2.current.focus()
      }
    }
  };

  const showToast = (data) => {
    //console.log("showing toast")
    Toast.show({
      type: 'success',
      text1: data,
      topOffset: 5,
      visibilityTime: 3000, //default 4000  
      autoHide: true
    });
  }

  const errorToastShow = (message) => {
    Toast.show({
      type: 'error',
      text1: message,
      topOffset: 5,
      visibilityTime: 3000, //default 4000  
      autoHide: true
    });
  }

  const submit = async () => {
    setDisable(true)
    try {
      let submitData = new FormData();

      for (let key in inputs) {
        let input = inputs[key as keyof {
          first_name: string, last_name: string, title: string, company_name: string,
          tel: string, email: string, address: string, website: string, description: string
        }]
        input = input.toString().toLowerCase()
        if (key == "tel" || key == "imgSrc") {
        } else {
          submitData.append(key, input);
        }
        //console.log(submitData)
      }
      // if (iconSrc) {
      //   submitData.append("profile_image", {
      //     uri: iconSrc.uri,//"file:///storage/emulated/0/Android/data/com.ecardexpress/files/Pictures/7ab4d6da-2bee-47ca-acc5-fcc2afa747fb.jpg",
      //     type: 'image/jpg',
      //     name: `card.jpg`,
      //   });
      // }

      // const statResult = await stat(inputs.imgSrc.uri);
      // console.log('file size: ' + statResult.size);

      if (inputs.imgSrc) {
        submitData.append("card_image", {
          uri: inputs.imgSrc.uri,
          type: 'image/jpeg',
          name: `${inputs.first_name}_${inputs.last_name}.jpg`,
        });
      }

      interface Tel {
        tel_number: string, category: string
      }
      submitData['tel'] = []
      let telInfos: Array<Tel> = []
      for (let i = 0; i < telephone.length; i++) {
        let telInfo: Tel = { tel_number: "", category: "" }
        if (telephone[i].telephone) {
          telInfo["tel_number"] = telephone[i].telephone
          telInfo["category"] = telephone[i].category
          telInfos.push(telInfo)
        }
      }
      console.log(telInfos)
      submitData.append('tel', JSON.stringify(telInfos))

      // let result = await dispatch(updateUserProfile(submitData)).unwrap()

      // if (result == `User profile updated`) {
      //   let values = await AsyncStorage.multiGet(['@email', '@isLoggedIn',])
      //   let emailByLocalStorage = values[0][1]
      //   let isLoggedInByLocalStorage = values[1][1]
      //   if (emailByLocalStorage && isLoggedInByLocalStorage) {
      //     await dispatch(getMyInfo({ email: emailByLocalStorage, isLoggedIn: isLoggedInByLocalStorage })).unwrap()
      //     props.navigation.navigate("Footer")
      //     return
      //   }
      // }
      console.log("start fetching")
      let res = await fetch(process.env.REACT_NATIVE_APP_HOSTING + `userProfile`, {
        method: 'POST',
        headers: {
          //Accept: 'application/json',
          "Content-Type": "multipart/form-data"
        },
        body: submitData,
      });

      console.log("Check res: ", res)

      if (res.status.toString().startsWith("5")) {
        console.log("Internal create user error")
        errorToastShow('Network error. Please try again')
        setDisable(false)
        return
      }

      let result = await res.json()
      console.log("Check create user result: ", result)

      if (res.status.toString().startsWith("4")) {
        console.log(result.message)
        if (result.message == 'File corrupted') //occur when file uploaded is empty
          errorToastShow('Network error. Please try again')
        setDisable(false)
        return
      }
      if (res.ok) {
        console.log("Create card success")
        setDisable(false)
        showToast("Create card success")
        props.navigation.navigate("Footer")
      }
    } catch (e) {
      console.log('error -', e)
      errorToastShow('Network error. Please try again')
      setDisable(false)
    };
  }

  /* const onLayout = (event: any) => {
    const { x, y, height, width } = event.nativeEvent.layout;
    console.log(x)
    console.log(y)
    console.log(height)
    console.log(width)
  } */
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar barStyle={Platform.OS === 'ios' ? 'dark-content' : 'light-content'} backgroundColor={COLORS.primaryColor} />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => {
          if (changed) {
            createAlert()
          } else {
            props.navigation.goBack()
          }
        }}>
          <View style={{ backgroundColor: COLORS.primaryColor, marginRight: 16, }}>
            <FontAwesomeIcon icon={faArrowLeft} style={{ color: COLORS.white }} size={18} />
          </View>
        </TouchableOpacity>
        <Text style={styles.headerText}>Edit Profile</Text>
      </View>

      <View style={styles.upperPart} >
        {/* <TouchableOpacity onPress={getIcon}>
                {!iconSrc ?
                  <View style={styles.bigCircle}>
                    <PersonFill fill={COLORS.white} width="90" height="90" viewBox="-3 -3 22 22" />
                  </View> :
                  <Image style={styles.imgCircle} source={iconSrc} />
                }
                <View style={styles.plusLogo}>
            <Text style={styles.plusText}>+</Text>
                </View>
              </TouchableOpacity>
              <Text style={styles.p}>Create your ecard</Text> */}
        <Image style={{
          marginBottom: 15,
          height: 500 / 2.5,
          width: 1000 / 2.5,
        }} source={inputs.imgSrc ? inputs.imgSrc : require('../../assets/img/icon/gallery.png')}
          resizeMode="contain" />
        {/* <TouchableNativeFeedback onPress={() => props.navigation.navigate("Upload Card")}>
                <Text style={styles.uploadText}>Scan your Business Card</Text>
        </TouchableNativeFeedback> */}
      </View>
      <ScrollView showsVerticalScrollIndicator={false} onMomentumScrollEnd={(e) => { changeDropdownPositions(e.nativeEvent.contentOffset.y) }}>
        <View style={styles.container}>
          <View style={styles.innerContainer}>
            <InfoInputRow label="First Name" value={inputs.first_name}
              onChangeText={text => handleOnchange({ text: text, input: "first_name" })}
              onDelete={() => { clearInput("first_name") }}></InfoInputRow>
            <InfoInputRow label="Last Name" value={inputs.last_name}
              onChangeText={text => handleOnchange({ text: text, input: "last_name" })}
              onDelete={() => { clearInput("last_name") }}></InfoInputRow>
            <InfoInputRow label="Title" value={inputs.title}
              onChangeText={text => handleOnchange({ text: text, input: "title" })}
              onDelete={() => { clearInput("title") }}></InfoInputRow>
            <InfoInputRow label="Company" value={inputs.company_name}
              onChangeText={text => handleOnchange({ text: text, input: "company_name" })}
              onDelete={() => { clearInput("company_name") }}></InfoInputRow>
            <View style={styles.telInputRow}>
              <View style={styles.telHeader}>
                <Text style={styles.label}>Tel</Text>
                <TouchableNativeFeedback onPress={() => { addTelephones() }}>
                  <View style={styles.plusLogo}>
                    <Text style={styles.plusText}>+</Text>
                  </View>
                </TouchableNativeFeedback>
              </View>
              {/* <InputWithDropdown position={topHeight} category={telephones[0].category}
            onChangeText={tel => handleTelephoneOnchange({ tel: tel, index: 0 })}
            onSelect={category => handleCategoryOnchange({ category: category, index: 0 })}
          /> */}
              <>
                {telephone ? telephone.map((telephone, key) => {
                  return (
                    <InputWithDropdown position={telephone.topHeight} category={toCapitalise(telephone.category)} dy={telephone.dy} key={key} value={telephone.telephone}
                      onChangeText={tel => handleTelephoneOnchange({ tel: tel, index: telephone.id })}
                      onSelect={category => handleCategoryOnchange({ category: category, index: telephone.id })}
                      onDelete={() => { deleteTelephones(telephone.id) }}
                    />
                  )
                }) : ""}
              </>
            </View>
            <InfoInputRow label="Email" value={inputs.email}
              onChangeText={text => handleOnchange({ text: text, input: "email" })}
              onDelete={() => { clearInput("email") }}></InfoInputRow>
            <InfoInputRow label="Address" value={inputs.address}
              onChangeText={text => handleOnchange({ text: text, input: "address" })}
              onDelete={() => { clearInput("address") }}></InfoInputRow>
            <InfoInputRow label="Website" value={inputs.website}
              onChangeText={text => handleOnchange({ text: text, input: "website" })}
              onDelete={() => { clearInput("website") }}></InfoInputRow>
            <View style={styles.aboutMeRow}>
              <Text style={styles.label}>About Me :</Text>
              <View style={styles.aboutMeContainer}>
                <TextInput style={styles.aboutMeInput} value={descriptionRow[0]} maxLength={37} ref={descriptionInput0}
                  onChangeText={(text: string) => handleDescriptionOnChange({ text: text, input: 0 })}>
                </TextInput>
                <TextInput style={styles.aboutMeInput} value={descriptionRow[1]} maxLength={37} ref={descriptionInput1}
                  onChangeText={(text: string) => handleDescriptionOnChange({ text: text, input: 1 })}>
                </TextInput>
                <TextInput style={styles.aboutMeInput} value={descriptionRow[2]} maxLength={37} ref={descriptionInput2}
                  onChangeText={(text: string) => handleDescriptionOnChange({ text: text, input: 2 })}>
                </TextInput>
              </View>
            </View>
            <View style={{ marginBottom: 8 }}></View>
          </View>
        </View>
      </ScrollView>
      <View style={styles.buttonContainer}>
        <Button
          disabled={disable}
          title="Create"
          onPress={() => submit()}
        />
      </View>
    </SafeAreaView >
  );
};

interface Props {
  label: string,
  value: string,
  onChangeText?: (text: string) => void,
  onDelete?: () => void;
}

const InfoInputRow = (props: Props) => {
  const [isFocused, setIsFocused] = useState(false);
  return (
    <View style={styles.inputRow}>
      <Text style={styles.label}>{props.label} :</Text>
      <View style={styles.rightPart}>
        <TextInput style={[styles.input, { borderBottomWidth: isFocused ? 1 : 0 }]}
          value={props.value}
          onFocus={() => { setIsFocused(true); }}
          onBlur={() => { setIsFocused(false); }}
          onChangeText={props.onChangeText}
        >
        </TextInput>
        <View style={styles.rightPart}>
          <TouchableNativeFeedback onPress={props.onDelete} style={styles.searchSection}>
            <View style={styles.cancel}>
              <FontAwesomeIcon icon={faXmark} style={{ color: COLORS.light }} size={18} />
            </View>
          </TouchableNativeFeedback>
        </View>
      </View>
    </View>
  )

}

interface Props2 {
  onChangeText?: (text: string) => void,
  onSelect: (item: string) => void;
  onDelete: () => void;
  category: string,
  position: number,
  dy: number,
  value: string,
}

function toCapitalise(word) {
  return word.charAt(0).toUpperCase() + word.slice(1);
}

const InputWithDropdown = (props: Props2) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  return (
    <View style={styles.telDropdownRow}>
      <Modal
        animationType="none"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <Pressable onPress={() => { setModalVisible(false); }}>
          <View style={{ width: "100%", height: "100%" }}></View>
        </Pressable>
        <View style={[styles.dropdownContainer, { top: props.position - props.dy }]}>
          <Pressable style={styles.dropdownItem} onPress={() => {
            props.onSelect("Work")
            setModalVisible(!modalVisible)
          }}>
            <Text style={styles.dropdownText}>Work</Text>
          </Pressable>
          <Pressable style={styles.dropdownItem} onPress={() => {
            props.onSelect("Office")
            setModalVisible(!modalVisible)
          }}>
            <Text style={styles.dropdownText}>Office</Text>
          </Pressable>
          <Pressable style={styles.dropdownItem} onPress={() => {
            props.onSelect("Personal")
            setModalVisible(!modalVisible)
          }}>
            <Text style={styles.dropdownText}>Personal</Text>
          </Pressable>
          <Pressable style={styles.dropdownItem} onPress={() => {
            props.onSelect("Direct")
            setModalVisible(!modalVisible)
          }}>
            <Text style={styles.dropdownText}>Direct</Text>
          </Pressable>
          <Pressable style={styles.dropdownItem} onPress={() => {
            props.onSelect("Fax")
            setModalVisible(!modalVisible)
          }}>
            <Text style={styles.dropdownText}>Fax</Text>
          </Pressable>
        </View>
      </Modal>
      <TouchableNativeFeedback onPress={() => setModalVisible(!modalVisible)} >
        <Text style={[styles.label, { color: COLORS.darkGrey, textAlign: 'center' }]}>{props.category} :</Text>
      </TouchableNativeFeedback>
      <View style={styles.rightPart}>
        <TextInput style={[styles.input, { borderBottomWidth: isFocused ? 1 : 0 }]} keyboardType='numeric'
          onChangeText={props.onChangeText}
          maxLength={8}
          onFocus={() => { setIsFocused(true); }}
          onBlur={() => { setIsFocused(false); }}
          value={props.value}
        ></TextInput>
        <TouchableNativeFeedback onPress={props.onDelete}>
          <View style={styles.cancel}>
            <FontAwesomeIcon icon={faXmark} style={{ color: COLORS.light }} size={18} />
          </View>
        </TouchableNativeFeedback>
      </View>
    </View>
  )

}


const styles = StyleSheet.create({
  container: {
    paddingTop: 0,
    flex: 1,
    display: "flex",
  },
  header: {
    flex: 1,
    display: "flex",
    flexDirection: "row",
    justifyContent: 'space-between',
    alignItems: "center",
    // color: 
  },
  innerContainer: {
    alignItems: 'center',
    justifyItems: 'center',
    display: "flex",
  },
  upperPart: {
    alignItems: 'center',
    justifyItems: 'center',
    display: "flex",
    //marginTop: 16,
  },
  bigCircle: {
    width: 90,
    height: 90,
    borderRadius: 100,
    backgroundColor: COLORS.lightBlue,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  imgCircle: {
    width: 64,
    height: 64,
    borderRadius: 100,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  buttonContainer: {
    paddingVertical: 24,
    paddingHorizontal: 10,
    //   backgroundColor: COLORS.white,
    //   ...Platform.select({
    //     ios: {
    //         shadowColor: '#000',
    //         shadowOffset: { width: 0, height: 2 },
    //         shadowOpacity: 0.2,
    //     },
    //     android: {
    //         elevation: 2,
    //     },
    // }),
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 32,
    //borderRadius: 4,
    //elevation: 3,
    //backgroundColor: 'black',
  },
  buttonText: {
    fontSize: 18,
    lineHeight: 21,
    fontWeight: 'bold',
    //letterSpacing: 0.25,
    color: COLORS.black,
  },
  logoText: {
    color: "white",
    textAlign: "center",
    lineHeight: 24,
  },
  h3: {
    fontSize: 22,
    color: COLORS.darkGrey,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  p: {
    fontSize: 14,
    color: COLORS.darkGrey,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  inputRow: {
    display: "flex",
    flexDirection: "row",
    justifyContent: 'flex-start',
    alignItems: "center",
    height: 45,
    width: "100%",
    marginBottom: 5,
    backgroundColor: COLORS.white,
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  label: {
    width: "25%",
    fontSize: 16,
  },
  input: {
    fontSize: 16,
    color: COLORS.darkGrey,
    height: 25,
    width: "85%",
    borderColor: COLORS.primaryColor,
    borderBottomWidth: 1,
    padding: 0,
  },
  telInputRow: {
    width: "100%",
    // height: 80,
    backgroundColor: COLORS.white,
    paddingHorizontal: 10,
    marginBottom: 5,
  },
  telHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 13,
    width: "100%",
    height: 20,
  },
  telDropdownRow: {
    display: 'flex',
    position: 'relative',
    flexDirection: "row",
    justifyContent: 'space-between',
    alignItems: "center",
    height: 45,
    // paddingBottom: ,
  },
  dropdownContainer: {
    height: 175,
    width: "21%",
    backgroundColor: COLORS.white,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    position: "absolute",
    top: 0,
    left: 10,
  },
  dropdownItem: {
    alignItems: "center",
    justifyContent: "center",
    height: 35,
    width: "100%",
    backgroundColor: COLORS.white,
    // borderBottomWidth:0.5,
    // borderBottomColor: COLORS.light,
    // marginBottom:2,
  },
  dropdownText: {
    color: COLORS.darkGrey,
    fontSize: 16,
  },
  rightPart: {
    display: "flex",
    flexDirection: "row",
    justifyContent: 'space-between',
    alignItems: "center",
    width: "75%",
  },
  plusLogo: {
    width: 18,
    height: 18,
    borderRadius: 100,
    backgroundColor: COLORS.primaryColor,
    marginRight: 8,
  },
  plusText: {
    color: COLORS.white,
    lineHeight: 20,
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: "center",
  },
  cancel: {
    marginRight: 8,
  },
  columns: {
    width: "45%",
  },
  uploadText: {
    color: COLORS.primaryColor,
    textAlign: 'center',
  },
  aboutMeRow: {
    backgroundColor: COLORS.white,
    paddingHorizontal: 10,
    width: "100%",
    paddingVertical: 16,
  },
  aboutMeContainer: {
    marginTop: 10,
    borderWidth: 1,
    borderColor: COLORS.darkGrey,
    borderRadius: 8,
    width: "100%",
    height: 85,
    padding: 10,
    paddingHorizontal: 14,
  },
  aboutMeInput: {
    width: "100%",
    height: 20,
    fontSize: 16,
    padding: 0,
    margin: 0,
    // borderWidth:1,
  },
  searchSection: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
});

export default CardCreate;



{/* <Input label="First Name" editable={true} value={inputs.first_name} error={errors.first_name} maxLength={20} onChangeText={text => handleOnchange({ text: text, input: "first_name" })}></Input>
            <Input label="Last Name" editable={true} value={inputs.last_name} error={errors.last_name} maxLength={20} onChangeText={text => handleOnchange({ text: text, input: "last_name" })}></Input>
            <Input label="Title" editable={true} value={inputs.title} error={errors.title} maxLength={20} onChangeText={text => handleOnchange({ text: text, input: "title" })}></Input>
            <Input label="Company" editable={true} value={inputs.company_name} error={errors.company_name} maxLength={20} onChangeText={text => handleOnchange({ text: text, input: "company_name" })}></Input>
            <Input label="Phone" editable={true} value={inputs.tel} error={errors.tel} maxLength={20} onChangeText={text => handleOnchange({ text: text, input: "tel" })}></Input>
            <Input label="Email" editable={true} value={inputs.email} error={errors.email} maxLength={20} onChangeText={text => handleOnchange({ text: text, input: "email" })}></Input>
            <Input label="Address" editable={true} value={inputs.address} error={errors.address} maxLength={20} onChangeText={text => handleOnchange({ text: text, input: "address" })}></Input>
            <Input label="Website" editable={true} value={inputs.website} error={errors.website} maxLength={20} onChangeText={text => handleOnchange({ text: text, input: "website" })}></Input>
            <Input label="About me" editable={true} value={inputs.description} error={errors.description} maxLength={20} onChangeText={text => handleOnchange({ text: text, input: "description" })}></Input> */}
