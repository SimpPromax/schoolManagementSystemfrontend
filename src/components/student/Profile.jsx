import React from 'react';
import { User, Mail, Phone, MapPin, Users, Heart, Car, Award, Edit } from 'lucide-react';
import { Link } from 'react-router-dom';

const Profile = () => {
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Personal Profile - John Smith</h1>
          <p className="text-gray-600 mt-2">Student ID: STU20240025 | Grade 10-A</p>
        </div>
        <button className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition">
          <Edit className="w-4 h-4" />
          Edit Profile
        </button>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Personal Information */}
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
            <User className="w-5 h-5 text-gray-500" />
            Personal Information
          </h2>

          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-32 h-32 bg-gray-200 rounded-lg flex items-center justify-center">
                <User className="w-16 h-16 text-gray-400" />
              </div>
              <div className="space-y-2">
                <div>
                  <p className="text-sm text-gray-600">Student ID</p>
                  <p className="font-medium">STU20240025</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Date of Birth</p>
                  <p className="font-medium">June 15, 2009 (Age: 15)</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-4">
              <div>
                <p className="text-sm text-gray-600">Blood Group</p>
                <p className="font-medium">O+</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Nationality</p>
                <p className="font-medium">Indian</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Religion</p>
                <p className="font-medium">Christian</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Category</p>
                <p className="font-medium">General</p>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
            <Mail className="w-5 h-5 text-gray-500" />
            Contact Information
          </h2>

          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
              <div>
                <p className="font-medium">Address</p>
                <p className="text-gray-600">123 Maple Street, Springfield, 560001</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Phone className="w-5 h-5 text-gray-400" />
              <div>
                <p className="font-medium">Phone</p>
                <p className="text-gray-600">+91 9876543210</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-gray-400" />
              <div>
                <p className="font-medium">Email</p>
                <p className="text-gray-600">john.smith@springfield.edu</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Users className="w-5 h-5 text-gray-400 mt-0.5" />
              <div>
                <p className="font-medium">Emergency Contact</p>
                <p className="text-gray-600">Robert Smith (Father) +91 9876543211</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Family Information */}
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
            <Users className="w-5 h-5 text-gray-500" />
            Family Information
          </h2>

          <div className="space-y-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <p className="font-medium">Father: Robert Smith</p>
              <p className="text-sm text-gray-600">Engineer | Contact: +91 9876543211</p>
            </div>

            <div className="p-4 bg-green-50 rounded-lg">
              <p className="font-medium">Mother: Mary Smith</p>
              <p className="text-sm text-gray-600">Doctor | Contact: +91 9876543212</p>
            </div>

            <div className="p-4 bg-purple-50 rounded-lg">
              <p className="font-medium">Sibling: Sarah Smith</p>
              <p className="text-sm text-gray-600">Grade 8, Springfield High School</p>
            </div>
          </div>
        </div>

        {/* Medical Information */}
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
            <Heart className="w-5 h-5 text-gray-500" />
            Medical Information
          </h2>

          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
              <div>
                <p className="font-medium">Allergies</p>
                <p className="text-sm text-gray-600">Peanuts</p>
              </div>
              <span className="inline-flex px-2 py-1 text-sm font-medium rounded-full bg-red-100 text-red-700">Severe</span>
            </div>

            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium">Regular Medication</p>
                <p className="text-sm text-gray-600">None</p>
              </div>
              <span className="inline-flex px-2 py-1 text-sm font-medium rounded-full bg-gray-200 text-gray-700">None</span>
            </div>

            <div className="p-3 bg-blue-50 rounded-lg">
              <p className="font-medium">Last Medical Checkup</p>
              <p className="text-sm text-gray-600">Jan 15, 2024</p>
              <p className="text-sm text-gray-600 mt-1">Doctor: Dr. Wilson (Springfield Clinic)</p>
            </div>
          </div>
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Transport Details */}
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
            <Car className="w-5 h-5 text-gray-500" />
            Transport Details
          </h2>

          <div className="space-y-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <p className="font-medium">School Bus (Route 5)</p>
              <div className="grid grid-cols-2 gap-4 mt-3">
                <div>
                  <p className="text-sm text-gray-600">Bus Stop</p>
                  <p className="font-medium">Maple Street Stop</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Driver</p>
                  <p className="font-medium">Mr. Kumar</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 mt-3">
                <div>
                  <p className="text-sm text-gray-600">Pickup Time</p>
                  <p className="font-medium">7:30 AM</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Drop Time</p>
                  <p className="font-medium">3:45 PM</p>
                </div>
              </div>
            </div>

            <div className="p-3 bg-yellow-50 rounded-lg">
              <p className="font-medium">Transport Fee Status</p>
              <div className="flex justify-between items-center mt-2">
                <span className="text-sm text-gray-600">Annual Fee: ₹12,000</span>
                <span className="inline-flex px-2 py-1 text-sm font-medium rounded-full bg-green-100 text-green-700">PAID</span>
              </div>
            </div>
          </div>
        </div>

        {/* Achievements */}
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
            <Award className="w-5 h-5 text-gray-500" />
            Achievements
          </h2>

          <div className="space-y-4">
            <div className="p-4 bg-green-50 rounded-lg">
              <p className="font-medium">Football Team</p>
              <p className="text-sm text-gray-600">Inter-School Champions 2023</p>
              <p className="text-sm text-gray-500 mt-1">Captain of the winning team</p>
            </div>

            <div className="p-4 bg-blue-50 rounded-lg">
              <p className="font-medium">Science Fair</p>
              <p className="text-sm text-gray-600">2nd Prize (District Level)</p>
              <p className="text-sm text-gray-500 mt-1">Project: Renewable Energy Model</p>
            </div>

            <div className="p-4 bg-purple-50 rounded-lg">
              <p className="font-medium">Mathematics Olympiad</p>
              <p className="text-sm text-gray-600">Qualified for State Round</p>
              <p className="text-sm text-gray-500 mt-1">Rank: 15th in District</p>
            </div>
          </div>
        </div>
      </div>

      {/* Documents & Actions */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
        <h2 className="text-xl font-semibold mb-6">Documents & Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition-all text-left">
            <p className="font-medium">Download ID Card</p>
            <p className="text-sm text-gray-600">Valid until June 2025</p>
          </button>

          <button className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition-all text-left">
            <p className="font-medium">Update Medical Info</p>
            <p className="text-sm text-gray-600">Add new records</p>
          </button>

          <button className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition-all text-left">
            <p className="font-medium">Change Password</p>
            <p className="text-sm text-gray-600">Security settings</p>
          </button>
        </div>
      </div>

      <div className="text-center">
        <Link to="/student" className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium">
          ← Back to Dashboard
        </Link>
      </div>
    </div>
  );
};

export default Profile;
