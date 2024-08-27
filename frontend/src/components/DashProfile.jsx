import { Alert, Button, Modal, TextInput } from "flowbite-react";
import { useSelector, useDispatch } from "react-redux";
import { useRef, useEffect, useState } from "react";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { app } from "../firebase";
import {
  updateStart,
  updateSuccess,
  updateFailure,
  deleteSuccess,
  deleteFailure,
  deleteStart,
  signoutSuccess,
} from "../redux/user/user";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { Link } from "react-router-dom";
const DashProfile = () => {
  const { currentUser, error, loading } = useSelector((state) => state.user);
  const [imageFile, setImageFile] = useState(null);
  const [imageFileUrl, setImageFileUrl] = useState(null);
  const filePickRef = useRef();
  const [imageFileUploadProgress, setImageFileUploadProgress] = useState(null);
  const [imageFileUploadError, setImageFileUploadError] = useState(null);
  const [formData, setFormData] = useState({});
  const [imageUploading, setImageUploading] = useState(false);
  const [updateUserSuccess, setUpdateUserSuccess] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const dispatch = useDispatch();
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImageFileUrl(URL.createObjectURL(file));
    }
  };

  useEffect(() => {
    if (imageFile) {
      uploadImage();
    }
  }, [imageFile]);

  const uploadImage = async () => {
    setImageFileUploadError(null);
    setImageUploading(true);
    const storage = getStorage(app);
    const fileName = new Date().getTime() + imageFile.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, imageFile);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setImageFileUploadProgress(progress.toFixed(0));
      },
      (error) => {
        setImageFileUploadError(`Could not upload image ${error.message}`);
        setImageFileUploadProgress(null);
        setImageFile(null);
        setImageFileUrl(null);
        setImageUploading(false);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setImageFileUrl(downloadURL);
          setFormData({ ...formData, profilePicture: downloadURL });
          setImageUploading(false);
        });
      },
    );
  };
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(updateStart());
    setUpdateUserSuccess(null);
    if (Object.keys(formData).length === 0) {
      dispatch(updateFailure("NO change has been made"));
      return;
    }
    if (imageUploading) {
      dispatch(updateFailure("wait for image to be uploaded"));
      return;
    }
    try {
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) {
        dispatch(updateFailure(data.message));
      } else {
        dispatch(updateSuccess(data));
        setUpdateUserSuccess("User 's proflie updated successfullty");
        setFormData({});
      }
    } catch (err) {
      dispatch(updateFailure(err.message));
    }
  };
  const handleDeleteUser = async () => {
    setShowModal(false);
    try {
      dispatch(deleteStart());
      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok) {
        dispatch(deleteFailure(data.message));
      } else {
        dispatch(deleteSuccess());
      }
    } catch (err) {
      dispatch(deleteFailure(err.message));
    }
  };
  const handleSignout = async () => {
    try {
      const res = await fetch("/api/user/signout/");
      const data = await res.json();
      if (!res.ok) {
        console.log(data.message);
      } else {
        dispatch(signoutSuccess());
      }
    } catch (err) {
      console.log(err.message);
    }
  };
  return (
    <div className="max-w-lg w-full mx-auto p-3">
      <h1 className="my-7 text-center text-3xl font-semibold">Profile</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          ref={filePickRef}
          hidden
        />
        <div
          className="relative w-32 h-32 self-center cursor-pointer shadow-md overflow-hidden rounded-full"
          onClick={() => filePickRef.current.click()}
        >
          {imageFileUploadProgress && (
            <CircularProgressbar
              value={imageFileUploadProgress || 0}
              text={`${imageFileUploadProgress}%`}
              strokeWidth={5}
              styles={{
                root: {
                  width: "100%",
                  height: "100%",
                  position: "absolute",
                  top: 0,
                  left: 0,
                },
                path: {
                  stroke: `rgba(62, 152, 199, ${imageFileUploadProgress / 100
                    })`,
                },
              }}
            />
          )}
          <img
            src={imageFileUrl || `${currentUser.profilePicture}`}
            alt="user"
            className={`rounded-full w-full h-full object-cover border-8 border-[lightgray] ${imageFileUploadProgress &&
              imageFileUploadProgress < 100 &&
              "opacity-60"
              }`}
          />
        </div>
        {imageFileUploadError && (
          <Alert color="failure">{imageFileUploadError}</Alert>
        )}
        <TextInput
          type="text"
          id="username"
          placeholder="username"
          defaultValue={currentUser.username}
          onChange={handleChange}
        />
        <TextInput
          type="email"
          id="email"
          placeholder="email"
          defaultValue={currentUser.email}
          onChange={handleChange}
        />
        <TextInput
          type="password"
          id="password"
          placeholder="password"
          onChange={handleChange}
        />
        <Button
          type="submit"
          gradientDuoTone="purpleToBlue"
          outline
          disabled={loading || imageUploading}
        >
          {loading ? "loading..." : "Update"}
        </Button>
        {currentUser.isAdmin && (
          <Link to="/create-post">
            <Button
              type="button"
              gradientDuoTone="purpleToPink"
              className="w-full"
            >
              Create a Post
            </Button>
          </Link>
        )}
      </form>
      <div className="text-red-500 flex justify-between mt-5">
        <span onClick={() => setShowModal(true)} className="cursor-pointer">
          {" "}
          Delete Account
        </span>
        <span onClick={handleSignout} className="cursor-pointer">
          {" "}
          Sign out
        </span>
      </div>
      {updateUserSuccess && (
        <Alert color="success" className="mt-5">
          {updateUserSuccess}
        </Alert>
      )}
      {error && (
        <Alert color="failure" className="mt-5">
          {error}
        </Alert>
      )}
      <Modal
        show={showModal}
        onClose={() => setShowModal(false)}
        popup
        size="md"
      >
        <Modal.Header />
        <div className="text-center">
          <HiOutlineExclamationCircle className="h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto" />
          <h3 className="mb-5 text-lg text-gray-500 dark:text-gray-400">
            Are you sure you want to delete your account?
          </h3>
          <div className="flex justify-center gap-4">
            <Button color="failure" onClick={handleDeleteUser}>
              Yes,I&apos;m sure
            </Button>
            <Button color="gray" onClick={() => setShowModal(false)}>
              No,cancel
            </Button>
          </div>
        </div>
        <Modal.Body></Modal.Body>
      </Modal>
    </div>
  );
};

export default DashProfile;
