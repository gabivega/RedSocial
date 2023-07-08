import { useState} from "react";
import  {
    Box,
    Button,
    TextField,
    useMediaQuery,
    Typography,
    useTheme
} from "@mui/material";
//import EditOutlinedIcon from "@maui/icons-material/EditOutlined";
import { Formik } from "formik";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setLogin } from "state";
import Dropzone from "react-dropzone";
import FlexBetween from "components/FlexBetween";

const registerSchema = yup.object().shape({
    firstName: yup.string().required("required"),
    lastName: yup.string().required("required"),
    email: yup.string().email("invalid email").required("required"),
    password: yup.string().required("required"),
    location: yup.string().required("required"),
    occupation: yup.string().required("required"),
    picture: yup.string().required("required")
})

const loginSchema = yup.object().shape({
    email: yup.string().email("invalid email").required("required"),
    password: yup.string().required("required"),
})

const initialValuesRegister = {
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    location: "",
    occupation: "",
    picture: "",
}

const initialValuesLogin = {
    email: "test@test.com",
    password: "test"
}

const Form = () => {
    const [pageType, setPageType] = useState("login");
    const { palette } = useTheme();
    const dispatch = useDispatch();
    const navigate = useNavigate() ;
    const isNonMobile = useMediaQuery("min-width:600px");
    const isLogin = pageType === "login";
    const isRegister = pageType === "register";

    const register = async (values, onSubmitProps) => {

      const formData = new FormData();
      for (let value in values) {
        formData.append(value, values[value]);
      }
      formData.append('picturePath', image);

      const savedUserResponse = await fetch(
        "https://redsocial-backend.onrender.com/auth/register",
        {
          method: "POST",          
          body: formData
        }
      );
      const savedUser = await savedUserResponse.json();
      onSubmitProps.resetForm();

      if (savedUser) {
        setPageType("login");
      }
    };

    const login = async (values, onSubmitProps) => {
      const loggedInResponse = await fetch(
        "https://redsocial-backend.onrender.com/auth/login",
        {
          method: "POST",
          headers: {"Content-Type": "application/json"},
          body: JSON.stringify(values),
        }
      );
      const loggedIn = await loggedInResponse.json();
      onSubmitProps.resetForm();
      if (loggedIn) {
        dispatch(
          setLogin({
            user: loggedIn.user,
            token: loggedIn.token,
          })
        );
        navigate("/home")
      }
    }

    const handleFormSubmit = async (values, onSubmitProps) => {
      if (isLogin) await login(values, onSubmitProps);
      if (isRegister) await register(values, onSubmitProps);
    };

    const [image, setImage] = useState(null)
    const [imageName, setImageName] = useState(null)

    const cloudinaryUpload = async (file)=>{
      console.log(file);
      let formData = new FormData();
      formData.append("file", file)
      formData.append("upload_preset","jmxyjty3")
      formData.append("cloud_name","emprenet")
      for(let obj of formData) {
        console.log(obj);
      }
      const cloudinaryUpload = await fetch ("https://api.cloudinary.com/v1_1/emprenet/image/upload",
      {method: "POST",
      body:formData})
      const cloudinaryResponse = await cloudinaryUpload.json()
      console.log(cloudinaryResponse)
      console.log(cloudinaryResponse.secure_url)
      setImage(cloudinaryResponse.secure_url)
    }
    return (
        <Formik 
        onSubmit={handleFormSubmit}
        initialValues={isLogin ? initialValuesLogin : initialValuesRegister}
        validationSchema={isLogin ? loginSchema : registerSchema}
        >
            {({
                values,
                errors,
                touched,
                handleBlur,
                handleChange,
                handleSubmit,
                setFieldValue,
                resetForm,
            }) => (
                <form onSubmit={handleSubmit}>
                  {isLogin && <Typography fontWeight="300" variant="h6" sx={{mb:"1rem"}}>
                    Test Account email:
                    test@test.com / password: test
                  </Typography>}
                  <Box 
                    display="grid"
                    gap="30px"
                    gridTemplateColumns="repeat(2, minmax(0,1fr))"
                    sx={{"& > div": { gridColumn : isNonMobile ?  undefined :"span 4"}}}
                  >  
                  {isRegister && (
                  <>
                    <TextField
                    label= "First Name"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.firstName || ""}
                    name="firstName"
                    error={Boolean(touched.firstName) && Boolean(errors.firstName)}
                    helperText={touched.firstName && errors.firstName}
                    sx={{ gridColumn: "span 2"}}
                    />
                    <TextField
                    label= "Last Name"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.lastName  || ""}
                    name="lastName"
                    error={Boolean(touched.lastName) && Boolean(errors.lastName)}
                    helperText={touched.lastName && errors.lastName}
                    sx={{ gridCOlumn: "span 2"}}
                    />
                    <TextField
                    label= "Location Name"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.location  || ""}
                    name="location"
                    error={Boolean(touched.location) && Boolean(errors.location)}
                    helperText={touched.location && errors.location}
                    sx={{ gridCOlumn: "span 4"}}
                    />
                    <TextField
                    label= "Occupation"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.occupation  || ""}
                    name="occupation"
                    error={Boolean(touched.occupation) && Boolean(errors.occupation)}
                    helperText={touched.occupation && errors.location}
                    sx={{ gridColumn: "span 4"}}
                    />
                    <Box
                    gridColumn="span 4"
                    border={`1px solid ${palette.neutral.medium}`}
                    borderRadius="5px"
                    p="1rem"
                    >
                      <Dropzone
                        acceptedFiles=".jpg, .jpeg, .png"
                        multiple={false}
                        onDrop={(acceptedFiles)=> {  
                        setImageName(acceptedFiles[0].name)                  
                        setImage(acceptedFiles[0])
                        cloudinaryUpload(acceptedFiles[0])                      
                        }
                        }
                        >
                          {({ getRootProps, getInputProps}) => (
                            <Box
                              {...getRootProps()}
                              border={`2px dashed ${palette.primary.main}`}
                              p="1rem"
                              sx={{ "&:hover": { cursor: "pointer"} }}
                              >
                              <input { ...getInputProps()}/>
                                {!image ? (
                                  <p>Add Picture Here</p> ) : (
                                    <FlexBetween>
                                      <Typography>{imageName}</Typography>
                                    </FlexBetween>)
                                }
                            </Box>)
                            }
                      </Dropzone>
                    </Box>
                </>
              )}
              
              <TextField
                label= "Email"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.email  || ""}
                name="email"
                error={Boolean(touched.email) && Boolean(errors.email)}
                helperText={touched.email && errors.email}  
                sx={{ gridColumn: "span 4"}}
              />
              <TextField
                label= "Password"
                type="password"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.password  || ""}
                name="password"
                error={Boolean(touched.password) && Boolean(errors.password)}
                helperText={touched.password && errors.password}  
                sx={{ gridColumn: "span 4"}}
              />
           </ Box>        
           { /* BUTTONS */}
            <Box>
              <Button
              fullWidth
              type="submit"
              sx={{
                m:"2rem 0",
                p: "1rem",
                backgroundColor: palette.primary.main,
                color: palette.background.alt,
                "&:hover": { color:palette.primary.main },
               }}
              >
                {isLogin ? "LOGIN": "REGISTER"}
              </Button>
              <Typography 
              onClick= {()=> {
                setPageType(isLogin ? "register" : "login");
                initialValuesLogin.email = ""
                initialValuesLogin.password = ""
                resetForm();
              }}
              sx={{
                textDecoration:"underline",
                color: palette.primary.main,
                "&:hover":{
                  cursor:"pointer",
                  color: palette.primary.light,
                },
              }}
              >
                {isLogin ? "Don't have an account? Sign Up Here." :
                "Already have an account? Login Here." }
              </Typography>
            </Box>
                </ form>
            )
            }
      </ Formik>
    )
}

export default Form;

