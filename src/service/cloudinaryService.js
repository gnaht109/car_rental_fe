const uploadOneImage = async file => {
  const formData = new FormData()
  formData.append("file", file)
  formData.append("upload_preset", "car_upload")

  const res = await fetch(
    "https://api.cloudinary.com/v1_1/dppl7ce03/image/upload",
    { method: "POST", body: formData }
  )

  if (!res.ok) throw new Error("Upload failed");

  return res.json()


}

const cloudinaryService = {
    uploadOneImage,
}

export default cloudinaryService
