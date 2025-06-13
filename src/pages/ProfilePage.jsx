import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { UserCircle, Edit3, Shield, Save, Camera, Key } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuthStore } from '@/store/authStore';
import { useToast } from '@/components/ui/use-toast';

function ProfilePage() {
  const { user, updateUser, login } = useAuthStore();
  const { toast } = useToast();

  const [isEditingDetails, setIsEditingDetails] = useState(false);
  const [isEditingPassword, setIsEditingPassword] = useState(false);

  const [profileData, setProfileData] = useState({
    full_name: user?.full_name || '',
    email: user?.email || '',
    phone_number: user?.phone_number || '', 
    profile_picture: user?.profile_picture || ''
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: ''
  });
  
  const [profileImageFile, setProfileImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(user?.profile_picture || '');


  const handleProfileChange = (e) => {
    setProfileData({ ...profileData, [e.target.name]: e.target.value });
  };
  
  const handlePasswordChange = (e) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setProfileImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    // In a real app, you'd upload profileImageFile to a storage service first
    // For now, we'll just use the preview or existing URL
    const updatedUserData = { ...profileData, profile_picture: imagePreview };
    
    updateUser(updatedUserData); // This currently only updates zustand store
    toast({
      title: "Profile Updated",
      description: "Your profile details have been successfully updated.",
    });
    setIsEditingDetails(false);
  };
  
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmNewPassword) {
      toast({ title: "Password Mismatch", description: "New passwords do not match.", variant: "destructive" });
      return;
    }
    if (passwordData.newPassword.length < 6) {
      toast({ title: "Weak Password", description: "New password must be at least 6 characters.", variant: "destructive" });
      return;
    }

    try {
      // Mock password change: verify current password (using login logic for mock)
      await login(user.email, passwordData.currentPassword);
      // If successful, in a real app, you would call an API endpoint to change password
      // For this mock:
      // 1. Log the user out (or update token if backend handles it)
      // 2. Inform them to log in with new password (or just show success)
      // For this example, we'll just show success and update local state.
      // In real app this should call updateUser with new hashed password, or a dedicated changePassword endpoint
      
      toast({
        title: "Password Changed",
        description: "Your password has been successfully changed. (Mocked - no actual change)",
      });
      setPasswordData({ currentPassword: '', newPassword: '', confirmNewPassword: '' });
      setIsEditingPassword(false);
    } catch (error) {
       toast({ title: "Password Change Failed", description: "Incorrect current password.", variant: "destructive" });
    }
  };

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <Card className="healthcare-card">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <UserCircle className="w-6 h-6 text-teal-600" />
              <span>Profile Settings</span>
            </CardTitle>
            <CardDescription>Manage your personal information and account settings.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">
            {/* Profile Details Section */}
            <section>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-800">Personal Details</h3>
                <Button variant="outline" size="sm" onClick={() => setIsEditingDetails(!isEditingDetails)}>
                  <Edit3 className="w-4 h-4 mr-2" />
                  {isEditingDetails ? 'Cancel' : 'Edit'}
                </Button>
              </div>
              <form onSubmit={handleProfileSubmit} className="space-y-4">
                <div className="flex flex-col items-center space-y-4 mb-6">
                  <div className="relative">
                    <img
                      alt={profileData.full_name || "User profile"}
                      className="w-24 h-24 rounded-full object-cover border-2 border-teal-500"
                      src={imagePreview || `https://ui-avatars.com/api/?name=${encodeURIComponent(profileData.full_name || 'User')}&background=00b4a6&color=fff&size=96`}
                    />
                    {isEditingDetails && (
                      <label htmlFor="profile_picture_upload" className="absolute bottom-0 right-0 bg-teal-500 p-1.5 rounded-full cursor-pointer hover:bg-teal-600">
                        <Camera className="w-4 h-4 text-white" />
                        <input id="profile_picture_upload" type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                      </label>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="full_name">Full Name</Label>
                    <Input id="full_name" name="full_name" value={profileData.full_name} onChange={handleProfileChange} disabled={!isEditingDetails} />
                  </div>
                  <div>
                    <Label htmlFor="email">Email Address</Label>
                    <Input id="email" name="email" type="email" value={profileData.email} onChange={handleProfileChange} disabled />
                  </div>
                  <div>
                    <Label htmlFor="phone_number">Phone Number</Label>
                    <Input id="phone_number" name="phone_number" value={profileData.phone_number} onChange={handleProfileChange} disabled={!isEditingDetails} />
                  </div>
                  <div>
                    <Label>Role</Label>
                    <Input value={user?.role_name || ''} disabled />
                  </div>
                </div>
                {isEditingDetails && (
                  <Button type="submit" className="healthcare-gradient text-white w-full sm:w-auto">
                    <Save className="w-4 h-4 mr-2" />
                    Save Changes
                  </Button>
                )}
              </form>
            </section>

            {/* Change Password Section */}
            <section>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-800">Change Password</h3>
                <Button variant="outline" size="sm" onClick={() => setIsEditingPassword(!isEditingPassword)}>
                  <Key className="w-4 h-4 mr-2" />
                  {isEditingPassword ? 'Cancel' : 'Change'}
                </Button>
              </div>
              {isEditingPassword && (
                <motion.form 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  onSubmit={handlePasswordSubmit} className="space-y-4"
                >
                  <div>
                    <Label htmlFor="currentPassword">Current Password</Label>
                    <Input id="currentPassword" name="currentPassword" type="password" value={passwordData.currentPassword} onChange={handlePasswordChange} required />
                  </div>
                  <div>
                    <Label htmlFor="newPassword">New Password</Label>
                    <Input id="newPassword" name="newPassword" type="password" value={passwordData.newPassword} onChange={handlePasswordChange} required />
                  </div>
                  <div>
                    <Label htmlFor="confirmNewPassword">Confirm New Password</Label>
                    <Input id="confirmNewPassword" name="confirmNewPassword" type="password" value={passwordData.confirmNewPassword} onChange={handlePasswordChange} required />
                  </div>
                  <Button type="submit" className="healthcare-gradient text-white w-full sm:w-auto">
                    <Shield className="w-4 h-4 mr-2" />
                    Update Password
                  </Button>
                </motion.form>
              )}
            </section>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

export default ProfilePage;