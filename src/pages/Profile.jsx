import { useEffect, useState, useRef } from "react"
import API from "../api"

export default function Profile() {

  const [profile, setProfile] = useState({})
  const [originalProfile, setOriginalProfile] = useState({})
  const [editing, setEditing] = useState(false)
  const [loading, setLoading] = useState(true)

  // ✅ stable token
  const tokenRef = useRef(localStorage.getItem("token"))

  const fetchProfile = async () => {
    try {
      setLoading(true)

      const res = await API.get("/profile/", {
        headers: { Authorization: `Bearer ${tokenRef.current}` }
      })

      setProfile(res.data)
      setOriginalProfile(res.data) // ✅ backup

    } catch (err) {
      console.log(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProfile()
  }, [])

  const handleChange = (e) => {
    setProfile(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const handleImageChange = (e) => {
    setProfile(prev => ({
      ...prev,
      image: e.target.files[0]
    }))
  }

  const handleSave = async () => {

    const formData = new FormData()

    // ✅ send only editable fields
    const allowedFields = ["phone", "gender", "city", "state", "pincode", "image"]

    allowedFields.forEach(key => {
      if (profile[key] !== undefined && profile[key] !== null) {
        formData.append(key, profile[key])
      }
    })

    try {
      await API.put("/profile/", formData, {
        headers: {
          Authorization: `Bearer ${tokenRef.current}`,
          "Content-Type": "multipart/form-data"
        }
      })

      setEditing(false)
      fetchProfile()

    } catch (err) {
      console.log(err)
    }
  }

  // ✅ cancel restore
  const handleCancel = () => {
    setProfile(originalProfile)
    setEditing(false)
  }

  if (loading) {
    return <p className="text-center mt-5">Loading profile...</p>
  }

  return (
    <div className="container my-5">
  
      <div className="card shadow-lg border-0 rounded-4 p-4">
  
        {/* HEADER */}
        <div className="d-flex align-items-center gap-4 flex-wrap">
  
          {/* IMAGE */}
          <div style={{ position: "relative" }}>
  
            <img
              src={
                profile.image_url
                  ? profile.image_url
                  : "/images/default-user.png"
              }
              alt="profile"
              style={{
                width: "120px",
                height: "120px",
                borderRadius: "50%",
                objectFit: "cover",
                border: "3px solid #eee"
              }}
            />
  
            {editing && (
              <label
                style={{
                  position: "absolute",
                  bottom: 0,
                  right: 0,
                  background: "white",
                  color:'white',
                  borderRadius: "50%",
                  padding: "8px",
                  cursor: "pointer",
                  fontSize: "15px"
                }}
              >
                ✏️
                <input type="file" hidden onChange={handleImageChange} />
              </label>
            )}
  
          </div>
  
          {/* USER INFO */}
          <div>
            <h4 className="mb-1 text-dark">User: {profile.username}</h4>
            <p className="text-dark mb-1">Email: {profile.email}</p>
          </div>
  
        </div>
        <hr className="my-4" />
  
        {/* DETAILS */}
        <h5 className="mb-3 text-dark">Personal Details</h5>
  
        <div className="row">
  
          <div className="col-md-6 mb-3">
            <label className="small text-muted">Phone</label>
            <input
              name="phone"
              className="form-control"
              value={profile.phone || ""}
              onChange={handleChange}
              disabled={!editing}
            />
          </div>
  
          <div className="col-md-6 mb-3">
            <label className="small text-muted">Gender</label>
            <input
              name="gender"
              className="form-control"
              value={profile.gender || ""}
              onChange={handleChange}
              disabled={!editing}
            />
          </div>
  
          <div className="col-md-4 mb-3">
            <label className="small text-muted">City</label>
            <input
              name="city"
              className="form-control"
              value={profile.city || ""}
              onChange={handleChange}
              disabled={!editing}
            />
          </div>
  
          <div className="col-md-4 mb-3">
            <label className="small text-muted">State</label>
            <input
              name="state"
              className="form-control"
              value={profile.state || ""}
              onChange={handleChange}
              disabled={!editing}
            />
          </div>
  
          <div className="col-md-4 mb-3">
            <label className="small text-muted">Pincode</label>
            <input
              name="pincode"
              className="form-control"
              value={profile.pincode || ""}
              onChange={handleChange}
              disabled={!editing}
            />
          </div>
  
        </div>
  
        {/* BUTTONS */}
        <div className="d-flex justify-content-end mt-3">
  
          {!editing ? (
            <button className="btn btn-dark px-4" onClick={() => setEditing(true)}>
              Edit Profile
            </button>
          ) : (
            <>
              <button className="btn btn-outline-secondary me-2" onClick={handleCancel}>
                Cancel
              </button>
  
              <button className="btn btn-success px-4" onClick={handleSave}>
                Save Changes
              </button>
            </>
          )}
  
        </div>
  
      </div>
  
    </div>
  )
}