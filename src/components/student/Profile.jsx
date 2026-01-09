/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  User, Mail, Phone, MapPin, Users, Heart, Car, Award,
  Edit, Save, ChevronRight, ChevronLeft, Upload,
  CheckCircle, AlertCircle, X, Camera, Plus, Trash2,
  FileText, Calendar, GraduationCap, Home, Shield, Globe,
  Download, Lock, Bell, FileCheck, Star, Map, Briefcase,
  BookOpen, Activity, ClipboardCheck, Thermometer, Pill,
  Bus, Clock, Trophy, Medal, School, Cake, Droplets,
  Globe as GlobeIcon, Cross, Stethoscope, Navigation,
  Book, Music, Palette, Code, Target,
  Dumbbell, Microscope, Languages, Video, ArrowLeft,
  Loader2, AlertTriangle, RefreshCw
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Swal from 'sweetalert2';
import { Link, useParams, useNavigate } from 'react-router-dom';
import axiosInstance from '../../api/axiosConfig';
import { useAuth } from '../../contexts/AuthContext';

// ================== VIEW 1: LOADING VIEW ==================
const LoadingView = ({ user }) => (
  <div className="min-h-screen flex flex-col items-center justify-center bg-linear-to-br from-gray-50 to-blue-50 p-6">
    <div className="text-center space-y-6">
      <div className="relative">
        <div className="w-32 h-32 rounded-full bg-linear-to-r from-blue-100 to-indigo-100 flex items-center justify-center mx-auto">
          <Loader2 className="w-16 h-16 text-blue-600 animate-spin" />
        </div>
        <div className="absolute inset-0 rounded-full border-4 border-blue-200 border-t-blue-600 animate-spin"></div>
      </div>
      <div className="space-y-3">
        <h1 className="text-2xl font-bold text-gray-900">Checking Profile Status</h1>
        <p className="text-gray-600">Looking up student profile for: {user?.email}</p>
        <p className="text-sm text-gray-500">Please wait...</p>
        <div className="w-64 h-2 bg-gray-200 rounded-full overflow-hidden mx-auto">
          <div className="h-full bg-linear-to-r from-blue-500 to-blue-600 animate-pulse"></div>
        </div>
      </div>
      <div className="mt-4 p-4 bg-blue-50 rounded-lg max-w-md mx-auto">
        <p className="text-sm text-blue-700">What's happening:</p>
        <ul className="text-xs text-blue-600 mt-2 space-y-1">
          <li className="flex items-center gap-2">
            <CheckCircle className="w-3 h-3" />
            Checking authentication...
          </li>
          <li className="flex items-center gap-2">
            <CheckCircle className="w-3 h-3" />
            Verifying user role...
          </li>
          <li className="flex items-center gap-2">
            <Loader2 className="w-3 h-3 animate-spin" />
            Fetching student profile...
          </li>
          <li className="flex items-center gap-2">
            <Loader2 className="w-3 h-3 animate-spin" />
            Determining next steps...
          </li>
        </ul>
      </div>
    </div>
  </div>
);

// ================== VIEW 2: ERROR VIEW ==================
const ErrorView = ({ error, onRetry, onGoBack }) => (
  <div className="min-h-screen flex flex-col items-center justify-center bg-linear-to-br from-gray-50 to-blue-50 p-6">
    <div className="text-center space-y-6 max-w-md">
      <div className="w-24 h-24 rounded-full bg-linear-to-br from-red-100 to-pink-100 flex items-center justify-center mx-auto">
        <AlertTriangle className="w-12 h-12 text-red-500" />
      </div>
      <div className="space-y-3">
        <h1 className="text-2xl font-bold text-gray-900">Unable to Load Profile</h1>
        <p className="text-gray-600">{error}</p>
      </div>
      <div className="space-y-3">
        <button
          onClick={onRetry}
          className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-medium transition-colors w-full"
        >
          <RefreshCw className="w-5 h-5" />
          Try Again
        </button>
        <button
          onClick={onGoBack}
          className="inline-flex items-center justify-center gap-2 text-blue-600 hover:text-blue-800 font-medium w-full"
        >
          <ArrowLeft className="w-4 h-4" />
          Go Back to Dashboard
        </button>
      </div>
    </div>
  </div>
);

// ================== VIEW 3: CREATE/EDIT PROFILE VIEW ==================
const CreateEditProfileView = ({
  profile,
  isNewProfile,
  currentStep,
  steps,
  newFamilyMember,
  newAllergy,
  newAchievement,
  saving,
  user,
  onInputChange,
  onNextStep,
  onPrevStep,
  onSave,
  onCancel,
  onAddFamilyMember,
  onRemoveFamilyMember,
  onUpdateNewFamilyMember,
  onAddAllergy,
  onRemoveAllergy,
  onUpdateNewAllergy,
  onAddAchievement,
  onRemoveAchievement,
  onUpdateNewAchievement,
  onProfilePictureUpload,
  formatDate,
  renderStepContent
}) => (
  <div className="min-h-screen bg-linear-to-b from-gray-50 to-white p-4 md:p-6">
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {isNewProfile ? 'Create Student Profile' : 'Update Your Profile'}
          </h1>
          <p className="text-gray-600 mt-1">
            {isNewProfile 
              ? 'Please complete all required fields to create your student profile' 
              : 'Edit your profile information'
            }
          </p>
        </div>
        {!isNewProfile && (
          <button
            onClick={onCancel}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>
      <div className="relative">
        <div className="absolute top-5 left-0 right-0 h-0.5 bg-gray-200"></div>
        <div
          className="absolute top-5 left-0 h-0.5 bg-linear-to-br from-blue-500 to-blue-600 transition-all duration-500"
          style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
        ></div>
        <div className="flex justify-between relative z-10">
          {steps.map((step) => (
            <div key={step.id} className="flex flex-col items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                currentStep >= step.id
                  ? 'bg-linear-to-br from-blue-600 to-blue-700 text-white shadow-lg'
                  : 'bg-white border-2 border-gray-300 text-gray-400'
              }`}>
                <step.icon className="w-5 h-5" />
              </div>
              <div className="mt-2 text-center">
                <p className={`text-sm font-medium ${
                  currentStep >= step.id ? 'text-blue-700' : 'text-gray-500'
                }`}>
                  {step.title}
                </p>
                <p className="text-xs text-gray-400 mt-0.5">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
    
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
      <div className="p-6">
        <AnimatePresence mode="wait">
          {renderStepContent()}
        </AnimatePresence>
      </div>
      <div className="p-6 border-t border-gray-100 bg-gray-50">
        <div className="flex justify-between items-center">
          <button
            onClick={onPrevStep}
            disabled={currentStep === 1}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl transition-all ${
              currentStep === 1
                ? 'text-gray-400 cursor-not-allowed'
                : 'text-gray-700 hover:bg-white hover:shadow-sm border border-gray-300'
            }`}
          >
            <ChevronLeft className="w-4 h-4" />
            Previous
          </button>
          <div className="flex items-center gap-3">
            {currentStep < steps.length ? (
              <button
                onClick={onNextStep}
                className="flex items-center gap-2 px-5 py-2.5 bg-linear-to-br from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg hover:shadow-xl"
              >
                Next Step
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={onSave}
                disabled={saving}
                className={`flex items-center gap-2 px-6 py-2.5 ${
                  saving
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-linear-to-br from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700'
                } text-white rounded-xl transition-all shadow-lg hover:shadow-xl`}
              >
                {saving ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    {isNewProfile ? 'Creating...' : 'Saving...'}
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    {isNewProfile ? 'Create Profile' : 'Submit for Review'}
                  </>
                )}
              </button>
            )}
          </div>
        </div>
        <div className="mt-4">
          <div className="flex justify-between text-sm text-gray-600 mb-1">
            <span>Progress</span>
            <span>{Math.round((currentStep / steps.length) * 100)}% Complete</span>
          </div>
          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-linear-to-br from-blue-500 to-blue-600 transition-all duration-500"
              style={{ width: `${(currentStep / steps.length) * 100}%` }}
            ></div>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Step {currentStep} of {steps.length}: {steps[currentStep - 1]?.title}
          </p>
        </div>
      </div>
    </div>
    
    {isNewProfile && (
      <div className="mt-6 text-center">
        <button
          onClick={onCancel}
          className="text-gray-600 hover:text-gray-800 font-medium"
        >
          Cancel and return to dashboard
        </button>
      </div>
    )}
    
    <div className="mt-6 bg-linear-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-200">
      <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
        <CheckCircle className="w-5 h-5 text-blue-500" />
        Tips for Completing Your Profile
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-3 bg-white/50 rounded-lg">
          <p className="font-medium text-sm">✅ Be Accurate</p>
          <p className="text-xs text-gray-600 mt-1">Enter exact information as per official documents</p>
        </div>
        <div className="p-3 bg-white/50 rounded-lg">
          <p className="font-medium text-sm">📱 Update Contacts</p>
          <p className="text-xs text-gray-600 mt-1">Keep emergency contact numbers current</p>
        </div>
        <div className="p-3 bg-white/50 rounded-lg">
          <p className="font-medium text-sm">🩺 Medical Details</p>
          <p className="text-xs text-gray-600 mt-1">Important for school nurse and emergencies</p>
        </div>
      </div>
    </div>
  </div>
);

// ================== VIEW 4: VIEW PROFILE (READ-ONLY) ==================
const ViewProfileView = ({
  profile,
  user,
  formatDate,
  calculateAge,
  getSeverityColor,
  getAchievementTypeColor,
  getHobbyIcon,
  onEditProfile,
  onGoBack
}) => {
  // Helper functions specific to this view
  const renderFamilyMembers = () => {
    if (profile.familyMembers.length === 0) {
      return (
        <div className="p-8 text-center bg-gray-50 rounded-xl border border-dashed border-gray-300">
          <Users className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-600">No family members added yet</p>
        </div>
      );
    }

    return profile.familyMembers.map((member) => (
      <div
        key={member.id}
        className={`p-4 rounded-lg border ${
          member.isPrimary
            ? 'bg-linear-to-br from-blue-50 to-indigo-50 border-blue-200'
            : 'bg-gray-50 border-gray-200'
        }`}
      >
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center gap-2">
              <p className="font-semibold">{member.name}</p>
              <span className="text-xs px-2 py-1 bg-purple-100 text-purple-800 rounded-full">
                {member.relation}
              </span>
              {member.isPrimary && (
                <span className="text-xs px-2 py-1 bg-emerald-100 text-emerald-800 rounded-full">
                  Primary
                </span>
              )}
              {member.isEmergency && (
                <span className="text-xs px-2 py-1 bg-amber-100 text-amber-800 rounded-full">
                  Emergency
                </span>
              )}
            </div>
            <p className="text-sm text-gray-600 mt-1 flex items-center gap-2">
              <Briefcase className="w-4 h-4" />
              {member.occupation || 'Not specified'}
            </p>
            <div className="flex flex-wrap gap-3 mt-2">
              <p className="text-sm text-gray-500 flex items-center gap-1">
                <Phone className="w-3 h-3" />
                {member.phone || 'Not specified'}
              </p>
              {member.email && (
                <p className="text-sm text-gray-500 flex items-center gap-1">
                  <Mail className="w-3 h-3" />
                  {member.email}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    ));
  };

  const renderAllergies = () => {
    if (profile.allergies.length === 0) {
      return <p className="text-gray-600 p-3">No allergies recorded</p>;
    }

    return profile.allergies.map((allergy) => (
      <div key={allergy.id} className="p-3 bg-red-50 rounded-lg border border-red-200">
        <div className="flex justify-between items-center">
          <div>
            <div className="flex items-center gap-2">
              <Cross className="w-4 h-4 text-red-500" />
              <span className="font-medium">{allergy.name}</span>
            </div>
            {allergy.notes && (
              <p className="text-sm text-gray-600 mt-1">{allergy.notes}</p>
            )}
          </div>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSeverityColor(allergy.severity)}`}>
            {allergy.severity}
          </span>
        </div>
      </div>
    ));
  };

  const renderAchievements = () => {
    if (profile.achievements.length === 0) {
      return (
        <div className="md:col-span-3 p-8 text-center bg-gray-50 rounded-xl border border-dashed border-gray-300">
          <Trophy className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-600">No achievements recorded yet</p>
        </div>
      );
    }

    return profile.achievements.map((achievement) => (
      <div
        key={achievement.id}
        className="p-4 bg-linear-to-br from-gray-50 to-white rounded-xl border border-gray-200 hover:border-blue-300 transition-all"
      >
        <div className="flex items-start justify-between mb-3">
          <div>
            <div className="flex items-center gap-2">
              <Medal className="w-4 h-4 text-amber-500" />
              <span className={`text-xs px-2 py-1 rounded-full ${getAchievementTypeColor(achievement.type)}`}>
                {achievement.type}
              </span>
            </div>
            <p className="font-semibold mt-2">{achievement.title}</p>
          </div>
          <span className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded-full">
            {achievement.year}
          </span>
        </div>
        <p className="text-sm text-gray-600 mb-3">{achievement.description}</p>
        <div className="flex items-center justify-between">
          <span className="text-xs px-2 py-1 bg-blue-50 text-blue-700 rounded">
            {achievement.level} Level
          </span>
          {achievement.award && (
            <span className="text-xs font-medium text-amber-600">{achievement.award}</span>
          )}
        </div>
      </div>
    ));
  };

  const renderTransportDetails = () => {
    if (!profile.transportMode) {
      return (
        <div className="p-8 text-center bg-gray-50 rounded-xl border border-dashed border-gray-300">
          <Car className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-600">No transport details recorded</p>
        </div>
      );
    }

    return (
      <div className="p-4 bg-linear-to-br from-emerald-50 to-green-50 rounded-lg border border-emerald-200">
        <div className="flex items-center gap-2 mb-3">
          <Bus className="w-5 h-5 text-emerald-600" />
          <div>
            <p className="font-semibold">
              {profile.transportMode === 'SCHOOL_BUS' ? 'School Bus' : 
               profile.transportMode === 'PRIVATE_VEHICLE' ? 'Private Vehicle' :
               profile.transportMode === 'PUBLIC_TRANSPORT' ? 'Public Transport' :
               profile.transportMode === 'WALKING' ? 'Walking' : 'Other'} 
              {profile.busRoute ? ` - ${profile.busRoute}` : ''}
            </p>
            {profile.busNumber && (
              <p className="text-sm text-gray-600">Bus No: {profile.busNumber}</p>
            )}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            {profile.busStop && (
              <div className="flex items-center gap-2">
                <Navigation className="w-4 h-4 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-500">Bus Stop</p>
                  <p className="font-medium">{profile.busStop}</p>
                </div>
              </div>
            )}
            {profile.driverName && (
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-500">Driver</p>
                  <p className="font-medium">{profile.driverName}</p>
                </div>
              </div>
            )}
          </div>
          <div className="space-y-2">
            {profile.pickupTime && (
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-500">Pickup Time</p>
                  <p className="font-medium">{profile.pickupTime}</p>
                </div>
              </div>
            )}
            {profile.dropTime && (
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-500">Drop Time</p>
                  <p className="font-medium">{profile.dropTime}</p>
                </div>
              </div>
            )}
          </div>
        </div>
        {profile.driverContact && (
          <div className="mt-4 pt-3 border-t border-emerald-200">
            <p className="text-sm text-gray-500">Driver Contact</p>
            <p className="font-medium flex items-center gap-2">
              <Phone className="w-4 h-4" />
              {profile.driverContact}
            </p>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="p-6 space-y-6">
      <div className="mb-4">
        <button
          onClick={onGoBack}
          className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </button>
      </div>
      
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-linear-to-br from-blue-50 to-indigo-50 border border-blue-100 rounded-2xl shadow-sm p-6"
      >
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="relative">
              <div className="w-24 h-24 rounded-full bg-linear-to-br from-blue-100 to-purple-100 flex items-center justify-center overflow-hidden border-4 border-white shadow-lg">
                {profile.profilePicture ? (
                  <img
                    src={profile.profilePicture}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="w-12 h-12 text-blue-400" />
                )}
              </div>
              <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center border-4 border-white shadow-lg">
                <CheckCircle className="w-5 h-5 text-white" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-3xl font-bold text-gray-900">{profile.fullName}</h1>
                <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                  {profile.grade}
                </span>
              </div>
              <p className="text-gray-600 mt-2 flex items-center gap-2">
                <School className="w-4 h-4" />
                Student ID: <span className="font-mono font-semibold">{profile.studentId}</span>
              </p>
              <div className="flex flex-wrap gap-3 mt-3">
                <div className="flex items-center gap-1.5 text-sm text-gray-600">
                  <Cake className="w-4 h-4" />
                  {formatDate(profile.dateOfBirth)} ({calculateAge(profile.dateOfBirth)} years)
                </div>
                <div className="flex items-center gap-1.5 text-sm text-gray-600">
                  <Droplets className="w-4 h-4" />
                  Blood Group: <span className="font-semibold">{profile.bloodGroup}</span>
                </div>
                <div className="flex items-center gap-1.5 text-sm text-gray-600">
                  <GlobeIcon className="w-4 h-4" />
                  {profile.nationality}
                </div>
              </div>
            </div>
          </div>
          <button
            onClick={onEditProfile}
            className="flex items-center gap-2 px-5 py-2.5 bg-linear-to-br from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg hover:shadow-xl"
          >
            <Edit className="w-4 h-4" />
            Edit Profile
          </button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-blue-200">
          <div className="text-center">
            <p className="text-sm text-gray-500">Class Teacher</p>
            <p className="font-semibold">{profile.classTeacher || 'Not assigned'}</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-500">House</p>
            <p className="font-semibold text-blue-600">{profile.house || 'Not assigned'}</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-500">Roll Number</p>
            <p className="font-semibold">{profile.rollNumber || 'Not assigned'}</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-500">Admission Date</p>
            <p className="font-semibold">{formatDate(profile.admissionDate) || 'Not specified'}</p>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Contact Information */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white border border-gray-200 rounded-xl shadow-sm p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <MapPin className="w-5 h-5 text-blue-500" />
              Contact Information
            </h2>
            <span className="text-xs bg-emerald-100 text-emerald-800 px-2 py-1 rounded-full">
              Verified
            </span>
          </div>
          <div className="space-y-4">
            <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
              <Home className="w-5 h-5 text-blue-600 mt-0.5" />
              <div>
                <p className="font-medium">Residential Address</p>
                <p className="text-gray-600">{profile.address || 'Not specified'}</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Phone className="w-5 h-5 text-gray-600" />
                <div>
                  <p className="font-medium">Phone</p>
                  <p className="text-gray-600">{profile.phone || 'Not specified'}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Mail className="w-5 h-5 text-gray-600" />
                <div>
                  <p className="font-medium">Email</p>
                  <p className="text-gray-600">{profile.email}</p>
                </div>
              </div>
            </div>
            <div className="p-3 bg-linear-to-br from-amber-50 to-orange-50 rounded-lg border border-amber-200">
              <div className="flex items-center gap-2 mb-2">
                <Shield className="w-5 h-5 text-amber-600" />
                <p className="font-medium">Emergency Contact</p>
              </div>
              <div className="space-y-2">
                <p className="font-semibold">{profile.emergencyContactName || 'Not specified'} ({profile.emergencyRelation || 'Not specified'})</p>
                <p className="text-gray-600 flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  {profile.emergencyContactPhone || 'Not specified'}
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Family Information */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white border border-gray-200 rounded-xl shadow-sm p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <Users className="w-5 h-5 text-purple-500" />
              Family Information
            </h2>
            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
              {profile.familyMembers.length} members
            </span>
          </div>
          <div className="space-y-4">
            {renderFamilyMembers()}
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Medical Information */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white border border-gray-200 rounded-xl shadow-sm p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <Heart className="w-5 h-5 text-red-500" />
              Medical Information
            </h2>
            <div className="flex items-center gap-2">
              <Stethoscope className="w-4 h-4 text-gray-400" />
              <span className="text-xs text-gray-500">
                Last checkup: {formatDate(profile.lastCheckup) || 'Not recorded'}
              </span>
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <h3 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                <Thermometer className="w-4 h-4" />
                Allergies & Conditions
              </h3>
              <div className="space-y-2">
                {renderAllergies()}
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4 p-3 bg-gray-50 rounded-lg">
              <div className="text-center">
                <p className="text-sm text-gray-500">Height</p>
                <p className="font-semibold">{profile.height || 'Not recorded'}</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-500">Weight</p>
                <p className="font-semibold">{profile.weight || 'Not recorded'}</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-500">Blood Pressure</p>
                <p className="font-semibold">{profile.bloodPressure || 'Not recorded'}</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Transport Details */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white border border-gray-200 rounded-xl shadow-sm p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <Car className="w-5 h-5 text-emerald-500" />
              Transport Details
            </h2>
            <span className={`text-xs px-2 py-1 rounded-full ${
              profile.transportFeeStatus === 'PAID'
                ? 'bg-emerald-100 text-emerald-800'
                : profile.transportFeeStatus === 'PENDING'
                ? 'bg-amber-100 text-amber-800'
                : 'bg-red-100 text-red-800'
            }`}>
              {profile.transportFeeStatus}
            </span>
          </div>
          <div className="space-y-4">
            {renderTransportDetails()}
            {profile.transportFee > 0 && (
              <div className="p-3 bg-amber-50 rounded-lg">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">Transport Fee</p>
                    <p className="text-2xl font-bold text-gray-900">₹{profile.transportFee.toLocaleString()}</p>
                  </div>
                  <div className={`px-3 py-1 rounded-full ${
                    profile.transportFeeStatus === 'PAID'
                      ? 'bg-emerald-100 text-emerald-800'
                      : profile.transportFeeStatus === 'PENDING'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {profile.transportFeeStatus}
                  </div>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Achievements & Activities */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-white border border-gray-200 rounded-xl shadow-sm p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-500" />
            Achievements & Activities
          </h2>
          <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded-full">
            {profile.achievements.length} achievements
          </span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {renderAchievements()}
        </div>
        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium text-gray-900 mb-4 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-blue-500" />
                Clubs & Societies
              </h3>
              <div className="flex flex-wrap gap-2">
                {profile.clubs.length === 0 ? (
                  <p className="text-gray-600">No clubs joined</p>
                ) : (
                  profile.clubs.map((club, index) => (
                    <span
                      key={index}
                      className="px-3 py-1.5 bg-linear-to-br from-blue-50 to-blue-100 text-blue-700 rounded-full text-sm font-medium border border-blue-200"
                    >
                      {club}
                    </span>
                  ))
                )}
              </div>
            </div>
            <div>
              <h3 className="font-medium text-gray-900 mb-4 flex items-center gap-2">
                <Activity className="w-5 h-5 text-green-500" />
                Hobbies & Interests
              </h3>
              <div className="flex flex-wrap gap-2">
                {profile.hobbies.length === 0 ? (
                  <p className="text-gray-600">No hobbies listed</p>
                ) : (
                  profile.hobbies.map((hobby, index) => {
                    const HobbyIcon = getHobbyIcon(hobby);
                    return (
                      <span
                        key={index}
                        className="px-3 py-1.5 bg-linear-to-br from-green-50 to-green-100 text-green-700 rounded-full text-sm font-medium border border-green-200 flex items-center gap-2"
                      >
                        <HobbyIcon className="w-3 h-3" />
                        {hobby}
                      </span>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-white border border-gray-200 rounded-xl shadow-sm p-6"
      >
        <h2 className="text-xl font-semibold mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="group p-4 border border-gray-200 rounded-xl hover:border-blue-300 hover:bg-blue-50 transition-all text-left">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
                <Download className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="font-medium">Download ID Card</p>
                <p className="text-sm text-gray-600">Valid until June 2025</p>
              </div>
            </div>
          </button>
          <button
            onClick={onEditProfile}
            className="group p-4 border border-gray-200 rounded-xl hover:border-emerald-300 hover:bg-emerald-50 transition-all text-left"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-100 rounded-lg group-hover:bg-emerald-200 transition-colors">
                <Edit className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <p className="font-medium">Update Profile</p>
                <p className="text-sm text-gray-600">Edit personal information</p>
              </div>
            </div>
          </button>
          <button className="group p-4 border border-gray-200 rounded-xl hover:border-purple-300 hover:bg-purple-50 transition-all text-left">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg group-hover:bg-purple-200 transition-colors">
                <FileCheck className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="font-medium">View Documents</p>
                <p className="text-sm text-gray-600">Certificates & reports</p>
              </div>
            </div>
          </button>
        </div>
      </motion.div>

      {/* Profile Status */}
      <div className="p-4 bg-linear-to-br from-emerald-50 to-green-50 rounded-xl border border-emerald-200">
        <div className="flex items-center gap-3">
          <CheckCircle className="w-6 h-6 text-emerald-500" />
          <div>
            <p className="font-semibold text-emerald-800">Profile Complete & Verified</p>
            <p className="text-sm text-emerald-700">All information is up-to-date and verified by school administration</p>
          </div>
        </div>
      </div>
    </div>
  );
};

// ================== MAIN PROFILE COMPONENT ==================
const Profile = () => {
  const { studentId } = useParams();
  const { user, isAuthenticated, getUserRole } = useAuth();
  const navigate = useNavigate();
  
  // State for the main component
  const [currentView, setCurrentView] = useState('loading'); // 'loading', 'error', 'create', 'view'
  const [isEditing, setIsEditing] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  
  // Profile state
  const [profile, setProfile] = useState({
    id: null,
    studentId: '',
    fullName: '',
    dateOfBirth: '',
    bloodGroup: '',
    nationality: '',
    religion: '',
    category: '',
    gender: '',
    profilePicture: null,
    address: '',
    phone: '',
    email: '',
    emergencyContactName: '',
    emergencyContactPhone: '',
    emergencyRelation: '',
    familyMembers: [],
    allergies: [],
    medications: [],
    medicalConditions: [],
    lastCheckup: '',
    doctorName: '',
    clinicName: '',
    bloodPressure: '',
    height: '',
    weight: '',
    transportMode: '',
    busRoute: '',
    busStop: '',
    driverName: '',
    driverContact: '',
    pickupTime: '',
    dropTime: '',
    transportFee: 0,
    transportFeeStatus: 'PENDING',
    busNumber: '',
    achievements: [],
    grade: '',
    rollNumber: '',
    academicYear: '',
    classTeacher: '',
    house: '',
    admissionDate: '',
    clubs: [],
    hobbies: [],
  });

  const [newFamilyMember, setNewFamilyMember] = useState({
    relation: 'FATHER',
    name: '',
    occupation: '',
    phone: '',
    email: '',
    isPrimary: false,
    isEmergency: false
  });

  const [newAllergy, setNewAllergy] = useState({
    name: '',
    severity: 'MILD',
    notes: ''
  });

  const [newAchievement, setNewAchievement] = useState({
    title: '',
    type: 'ACADEMIC',
    level: 'SCHOOL',
    year: new Date().getFullYear(),
    description: '',
    award: ''
  });

  const STEPS = useMemo(() => [
    { id: 1, title: 'Personal Info', icon: User, description: 'Basic details & photo' },
    { id: 2, title: 'Contact Details', icon: MapPin, description: 'Address & emergency' },
    { id: 3, title: 'Family Info', icon: Users, description: 'Family members' },
    { id: 4, title: 'Medical Info', icon: Heart, description: 'Health records' },
    { id: 5, title: 'Transport', icon: Car, description: 'Commute details' },
    { id: 6, title: 'Achievements', icon: Award, description: 'Awards & activities' },
    { id: 7, title: 'Review', icon: CheckCircle, description: 'Final review' },
  ], []);

  // ================== UTILITY FUNCTIONS ==================
  const formatDate = useCallback((dateString) => {
    if (!dateString) return 'Not specified';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }, []);

  const calculateAge = useCallback((dateString) => {
    if (!dateString) return 0;
    const today = new Date();
    const birthDate = new Date(dateString);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  }, []);

  const getSeverityColor = useCallback((severity) => {
    if (!severity) return 'bg-gray-100 text-gray-800';
    switch (severity.toLowerCase()) {
      case 'severe': return 'bg-red-100 text-red-800';
      case 'moderate': return 'bg-amber-100 text-amber-800';
      case 'mild': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }, []);

  const getAchievementTypeColor = useCallback((type) => {
    if (!type) return 'bg-gray-100 text-gray-800';
    switch (type.toLowerCase()) {
      case 'academic': return 'bg-blue-100 text-blue-800';
      case 'sports': return 'bg-green-100 text-green-800';
      case 'arts': return 'bg-purple-100 text-purple-800';
      case 'cultural': return 'bg-pink-100 text-pink-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }, []);

  const getHobbyIcon = useCallback((hobby) => {
    if (!hobby) return Activity;
    const hobbyLower = hobby.toLowerCase();
    if (hobbyLower.includes('read') || hobbyLower.includes('book')) return Book;
    if (hobbyLower.includes('football') || hobbyLower.includes('soccer')) return Target;
    if (hobbyLower.includes('paint') || hobbyLower.includes('art')) return Palette;
    if (hobbyLower.includes('code') || hobbyLower.includes('program')) return Code;
    if (hobbyLower.includes('music')) return Music;
    if (hobbyLower.includes('basketball')) return Activity;
    if (hobbyLower.includes('gym') || hobbyLower.includes('workout')) return Dumbbell;
    if (hobbyLower.includes('science') || hobbyLower.includes('lab')) return Microscope;
    if (hobbyLower.includes('language')) return Languages;
    if (hobbyLower.includes('movie') || hobbyLower.includes('video')) return Video;
    return Activity;
  }, []);

  const isProfileEmpty = useCallback(() => {
    if (!profile.id && !profile.studentId) return true;
    const essentialFields = [
      profile.fullName,
      profile.dateOfBirth,
      profile.gender,
      profile.grade,
      profile.email
    ];
    return essentialFields.some(field => !field || field.trim() === '');
  }, [profile]);

  // ================== API & HANDLER FUNCTIONS ==================
  const handleInputChange = useCallback((field, value) => {
    setProfile(prev => ({ ...prev, [field]: value }));
  }, []);

  const nextStep = useCallback(() => {
    if (currentStep < STEPS.length) {
      setCurrentStep(prev => prev + 1);
    }
  }, [currentStep, STEPS.length]);

  const prevStep = useCallback(() => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  }, [currentStep]);

  const handleAddFamilyMember = useCallback(async () => {
    if (!profile.id) {
      Swal.fire({
        title: 'Error!',
        text: 'Please save the basic profile first before adding family members.',
        icon: 'error',
        confirmButtonText: 'OK',
        confirmButtonColor: '#ef4444',
      });
      return;
    }

    try {
      const createDTO = {
        relation: newFamilyMember.relation,
        fullName: newFamilyMember.name,
        occupation: newFamilyMember.occupation,
        phone: newFamilyMember.phone,
        email: newFamilyMember.email,
        isPrimaryContact: newFamilyMember.isPrimary,
        isEmergencyContact: newFamilyMember.isEmergency
      };
      const response = await axiosInstance.post(`/students/${profile.id}/family-members`, createDTO);
      const newMember = {
        id: response.data.id,
        relation: response.data.relation,
        name: response.data.fullName,
        occupation: response.data.occupation,
        phone: response.data.phone,
        email: response.data.email,
        isPrimary: response.data.isPrimaryContact,
        isEmergency: response.data.isEmergencyContact
      };
      setProfile(prev => ({
        ...prev,
        familyMembers: [...prev.familyMembers, newMember]
      }));
      setNewFamilyMember({
        relation: 'FATHER',
        name: '',
        occupation: '',
        phone: '',
        email: '',
        isPrimary: false,
        isEmergency: false
      });
      Swal.fire({
        title: 'Success!',
        text: 'Family member added successfully.',
        icon: 'success',
        confirmButtonText: 'OK',
        confirmButtonColor: '#10b981',
      });
    } catch (err) {
      console.error('Error adding family member:', err);
      Swal.fire({
        title: 'Error!',
        text: err.response?.data?.error || 'Failed to add family member. Please try again.',
        icon: 'error',
        confirmButtonText: 'OK',
        confirmButtonColor: '#ef4444',
      });
    }
  }, [newFamilyMember, profile.id]);

  const handleRemoveFamilyMember = useCallback(async (memberId) => {
    try {
      await axiosInstance.delete(`/students/family-members/${memberId}`);
      setProfile(prev => ({
        ...prev,
        familyMembers: prev.familyMembers.filter(member => member.id !== memberId)
      }));
      Swal.fire({
        title: 'Removed!',
        text: 'Family member removed successfully.',
        icon: 'success',
        confirmButtonText: 'OK',
        confirmButtonColor: '#10b981',
      });
    } catch (err) {
      console.error('Error removing family member:', err);
      Swal.fire({
        title: 'Error!',
        text: 'Failed to remove family member.',
        icon: 'error',
        confirmButtonText: 'OK',
        confirmButtonColor: '#ef4444',
      });
    }
  }, []);

  const handleAddAllergy = useCallback(async () => {
    if (!profile.id) {
      Swal.fire({
        title: 'Error!',
        text: 'Please save the basic profile first before adding allergies.',
        icon: 'error',
        confirmButtonText: 'OK',
        confirmButtonColor: '#ef4444',
      });
      return;
    }

    try {
      const createDTO = {
        recordType: 'ALLERGY',
        name: newAllergy.name,
        severity: newAllergy.severity,
        notes: newAllergy.notes
      };
      const response = await axiosInstance.post(`/students/${profile.id}/medical-records`, createDTO);
      const newAllergyRecord = {
        id: response.data.id,
        name: response.data.name,
        severity: response.data.severity,
        notes: response.data.notes
      };
      setProfile(prev => ({
        ...prev,
        allergies: [...prev.allergies, newAllergyRecord]
      }));
      setNewAllergy({ name: '', severity: 'MILD', notes: '' });
      Swal.fire({
        title: 'Success!',
        text: 'Allergy added successfully.',
        icon: 'success',
        confirmButtonText: 'OK',
        confirmButtonColor: '#10b981',
      });
    } catch (err) {
      console.error('Error adding allergy:', err);
      Swal.fire({
        title: 'Error!',
        text: 'Failed to add allergy.',
        icon: 'error',
        confirmButtonText: 'OK',
        confirmButtonColor: '#ef4444',
      });
    }
  }, [newAllergy, profile.id]);

  const handleRemoveAllergy = useCallback(async (allergyId) => {
    try {
      await axiosInstance.delete(`/students/medical-records/${allergyId}`);
      setProfile(prev => ({
        ...prev,
        allergies: prev.allergies.filter(allergy => allergy.id !== allergyId)
      }));
      Swal.fire({
        title: 'Removed!',
        text: 'Allergy removed successfully.',
        icon: 'success',
        confirmButtonText: 'OK',
        confirmButtonColor: '#10b981',
      });
    } catch (err) {
      console.error('Error removing allergy:', err);
      Swal.fire({
        title: 'Error!',
        text: 'Failed to remove allergy.',
        icon: 'error',
        confirmButtonText: 'OK',
        confirmButtonColor: '#ef4444',
      });
    }
  }, []);

  const handleAddAchievement = useCallback(async () => {
    if (!profile.id) {
      Swal.fire({
        title: 'Error!',
        text: 'Please save the basic profile first before adding achievements.',
        icon: 'error',
        confirmButtonText: 'OK',
        confirmButtonColor: '#ef4444',
      });
      return;
    }

    try {
      const createDTO = {
        title: newAchievement.title,
        type: newAchievement.type,
        level: newAchievement.level,
        year: newAchievement.year,
        description: newAchievement.description,
        award: newAchievement.award
      };
      const response = await axiosInstance.post(`/students/${profile.id}/achievements`, createDTO);
      const newAchievementRecord = {
        id: response.data.id,
        title: response.data.title,
        type: response.data.type,
        level: response.data.level,
        year: response.data.year,
        description: response.data.description,
        award: response.data.award,
        verified: response.data.verified
      };
      setProfile(prev => ({
        ...prev,
        achievements: [...prev.achievements, newAchievementRecord]
      }));
      setNewAchievement({
        title: '',
        type: 'ACADEMIC',
        level: 'SCHOOL',
        year: new Date().getFullYear(),
        description: '',
        award: ''
      });
      Swal.fire({
        title: 'Success!',
        text: 'Achievement added successfully.',
        icon: 'success',
        confirmButtonText: 'OK',
        confirmButtonColor: '#10b981',
      });
    } catch (err) {
      console.error('Error adding achievement:', err);
      Swal.fire({
        title: 'Error!',
        text: 'Failed to add achievement.',
        icon: 'error',
        confirmButtonText: 'OK',
        confirmButtonColor: '#ef4444',
      });
    }
  }, [newAchievement, profile.id]);

  const handleRemoveAchievement = useCallback(async (achievementId) => {
    try {
      await axiosInstance.delete(`/students/achievements/${achievementId}`);
      setProfile(prev => ({
        ...prev,
        achievements: prev.achievements.filter(achievement => achievement.id !== achievementId)
      }));
      Swal.fire({
        title: 'Removed!',
        text: 'Achievement removed successfully.',
        icon: 'success',
        confirmButtonText: 'OK',
        confirmButtonColor: '#10b981',
      });
    } catch (err) {
      console.error('Error removing achievement:', err);
      Swal.fire({
        title: 'Error!',
        text: 'Failed to remove achievement.',
        icon: 'error',
        confirmButtonText: 'OK',
        confirmButtonColor: '#ef4444',
      });
    }
  }, []);

  const handleProfilePictureUpload = useCallback(async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    if (!profile.id) {
      Swal.fire({
        title: 'Error!',
        text: 'Please save the basic profile first before uploading a picture.',
        icon: 'error',
        confirmButtonText: 'OK',
        confirmButtonColor: '#ef4444',
      });
      return;
    }

    try {
      const formData = new FormData();
      formData.append('file', file);
      const response = await axiosInstance.post(`/students/${profile.id}/upload-profile-picture`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setProfile(prev => ({ ...prev, profilePicture: response.data.profilePicture }));
      Swal.fire({
        title: 'Success!',
        text: 'Profile picture uploaded successfully.',
        icon: 'success',
        confirmButtonText: 'OK',
        confirmButtonColor: '#10b981',
      });
    } catch (err) {
      console.error('Error uploading profile picture:', err);
      Swal.fire({
        title: 'Error!',
        text: 'Failed to upload profile picture.',
        icon: 'error',
        confirmButtonText: 'OK',
        confirmButtonColor: '#ef4444',
      });
    }
  }, [profile.id]);

  const handleSave = useCallback(async () => {
    setSaving(true);
    try {
      const updateData = {
        fullName: profile.fullName,
        dateOfBirth: profile.dateOfBirth,
        gender: profile.gender,
        bloodGroup: profile.bloodGroup,
        nationality: profile.nationality,
        religion: profile.religion,
        category: profile.category,
        grade: profile.grade,
        rollNumber: profile.rollNumber,
        classTeacher: profile.classTeacher,
        house: profile.house,
        address: profile.address,
        phone: profile.phone,
        email: profile.email || user?.email,
        emergencyContactName: profile.emergencyContactName,
        emergencyContactPhone: profile.emergencyContactPhone,
        emergencyRelation: profile.emergencyRelation,
        height: profile.height,
        weight: profile.weight,
        bloodPressure: profile.bloodPressure,
        lastMedicalCheckup: profile.lastCheckup,
        doctorName: profile.doctorName,
        clinicName: profile.clinicName,
        transportMode: profile.transportMode,
        busRoute: profile.busRoute,
        busStop: profile.busStop,
        busNumber: profile.busNumber,
        driverName: profile.driverName,
        driverContact: profile.driverContact,
        pickupTime: profile.pickupTime,
        dropTime: profile.dropTime,
      };
      
      let response;
      if (profile.id) {
        response = await axiosInstance.put(`/students/${profile.id}`, updateData);
      } else {
        const createData = {
          ...updateData,
          studentId: profile.studentId || `STU${new Date().getFullYear()}${String(Math.floor(Math.random() * 10000)).padStart(4, '0')}`,
          admissionDate: profile.admissionDate || new Date().toISOString().split('T')[0],
          academicYear: profile.academicYear || `${new Date().getFullYear()}-${new Date().getFullYear() + 1}`,
          email: user?.email || profile.email,
        };
        response = await axiosInstance.post('/students', createData);
      }
      
      const updatedProfile = response.data;
      const transformedProfile = {
        id: updatedProfile.id,
        studentId: updatedProfile.studentId,
        fullName: updatedProfile.fullName,
        dateOfBirth: updatedProfile.dateOfBirth,
        bloodGroup: updatedProfile.bloodGroup,
        nationality: updatedProfile.nationality,
        religion: updatedProfile.religion,
        category: updatedProfile.category,
        gender: updatedProfile.gender,
        profilePicture: updatedProfile.profilePicture,
        address: updatedProfile.address,
        phone: updatedProfile.phone,
        email: updatedProfile.email,
        emergencyContactName: updatedProfile.emergencyContactName,
        emergencyContactPhone: updatedProfile.emergencyContactPhone,
        emergencyRelation: updatedProfile.emergencyRelation,
        familyMembers: updatedProfile.familyMembers?.map(member => ({
          id: member.id,
          relation: member.relation,
          name: member.fullName,
          occupation: member.occupation,
          phone: member.phone,
          email: member.email,
          isPrimary: member.isPrimaryContact,
          isEmergency: member.isEmergencyContact
        })) || [],
        allergies: updatedProfile.medicalRecords?.filter(r => r.recordType === 'ALLERGY').map(a => ({
          id: a.id, name: a.name, severity: a.severity, notes: a.notes
        })) || [],
        medications: updatedProfile.medicalRecords?.filter(r => r.recordType === 'MEDICATION').map(m => ({
          id: m.id, name: m.name, frequency: m.frequency, notes: m.notes
        })) || [],
        medicalConditions: updatedProfile.medicalRecords?.filter(r => r.recordType === 'CONDITION').map(c => ({
          id: c.id, name: c.name, severity: c.severity, notes: c.notes
        })) || [],
        lastCheckup: updatedProfile.lastMedicalCheckup,
        doctorName: updatedProfile.doctorName,
        clinicName: updatedProfile.clinicName,
        bloodPressure: updatedProfile.bloodPressure,
        height: updatedProfile.height,
        weight: updatedProfile.weight,
        transportMode: updatedProfile.transportMode,
        busRoute: updatedProfile.busRoute,
        busStop: updatedProfile.busStop,
        driverName: updatedProfile.driverName,
        driverContact: updatedProfile.driverContact,
        pickupTime: updatedProfile.pickupTime,
        dropTime: updatedProfile.dropTime,
        transportFee: updatedProfile.transportFee || 0,
        transportFeeStatus: updatedProfile.transportFeeStatus || 'PENDING',
        busNumber: updatedProfile.busNumber,
        achievements: updatedProfile.achievements?.map(a => ({
          id: a.id,
          title: a.title,
          type: a.type,
          level: a.level,
          year: a.year,
          description: a.description,
          award: a.award,
          verified: a.verified
        })) || [],
        grade: updatedProfile.grade,
        rollNumber: updatedProfile.rollNumber,
        academicYear: updatedProfile.academicYear,
        classTeacher: updatedProfile.classTeacher,
        house: updatedProfile.house,
        admissionDate: updatedProfile.admissionDate,
        clubs: updatedProfile.clubs || [],
        hobbies: updatedProfile.hobbies || [],
      };
      
      setProfile(transformedProfile);
      
      Swal.fire({
        title: profile.id ? 'Profile Updated!' : 'Profile Created!',
        text: profile.id ? 'Your profile changes have been saved successfully.' : 'Your student profile has been created successfully.',
        icon: 'success',
        confirmButtonText: 'OK',
        confirmButtonColor: '#10b981',
        customClass: { popup: 'rounded-2xl' }
      }).then(() => {
        setCurrentView('view');
        setIsEditing(false);
        setCurrentStep(1);
      });
    } catch (err) {
      console.error('Error saving profile:', err);
      Swal.fire({
        title: 'Save Failed!',
        text: err.response?.data?.error || 'There was an error saving your profile. Please try again.',
        icon: 'error',
        confirmButtonText: 'OK',
        confirmButtonColor: '#ef4444',
      });
    } finally {
      setSaving(false);
    }
  }, [profile, user]);

  // ================== DATA FETCHING ==================
  const fetchProfileData = useCallback(async () => {
    setCurrentView('loading');
    setError(null);
    
    try {
      if (!isAuthenticated || !user) {
        throw new Error('User not authenticated. Please login.');
      }

      const userRole = getUserRole();
      if (userRole !== 'STUDENT') {
        throw new Error('This profile page is only available for students.');
      }

      let response;

      try {
        response = await axiosInstance.get(`/students/by-email/${encodeURIComponent(user.email)}`);
        
        const data = response.data;
        const transformedProfile = {
          id: data.id,
          studentId: data.studentId,
          fullName: data.fullName,
          dateOfBirth: data.dateOfBirth,
          bloodGroup: data.bloodGroup,
          nationality: data.nationality,
          religion: data.religion,
          category: data.category,
          gender: data.gender,
          profilePicture: data.profilePicture,
          address: data.address,
          phone: data.phone,
          email: data.email,
          emergencyContactName: data.emergencyContactName,
          emergencyContactPhone: data.emergencyContactPhone,
          emergencyRelation: data.emergencyRelation,
          familyMembers: data.familyMembers?.map(member => ({
            id: member.id,
            relation: member.relation,
            name: member.fullName,
            occupation: member.occupation,
            phone: member.phone,
            email: member.email,
            isPrimary: member.isPrimaryContact,
            isEmergency: member.isEmergencyContact
          })) || [],
          allergies: data.medicalRecords?.filter(r => r.recordType === 'ALLERGY').map(a => ({
            id: a.id, name: a.name, severity: a.severity, notes: a.notes
          })) || [],
          medications: data.medicalRecords?.filter(r => r.recordType === 'MEDICATION').map(m => ({
            id: m.id, name: m.name, frequency: m.frequency, notes: m.notes, prescribedBy: m.prescribedBy
          })) || [],
          medicalConditions: data.medicalRecords?.filter(r => r.recordType === 'CONDITION').map(c => ({
            id: c.id, name: c.name, severity: c.severity, notes: c.notes
          })) || [],
          lastCheckup: data.lastMedicalCheckup,
          doctorName: data.doctorName,
          clinicName: data.clinicName,
          bloodPressure: data.bloodPressure,
          height: data.height,
          weight: data.weight,
          transportMode: data.transportMode,
          busRoute: data.busRoute,
          busStop: data.busStop,
          driverName: data.driverName,
          driverContact: data.driverContact,
          pickupTime: data.pickupTime,
          dropTime: data.dropTime,
          transportFee: data.transportFee || 0,
          transportFeeStatus: data.transportFeeStatus || 'PENDING',
          busNumber: data.busNumber,
          achievements: data.achievements?.map(a => ({
            id: a.id, title: a.title, type: a.type, level: a.level, year: a.year,
            description: a.description, award: a.award, verified: a.verified
          })) || [],
          grade: data.grade,
          rollNumber: data.rollNumber,
          academicYear: data.academicYear,
          classTeacher: data.classTeacher,
          house: data.house,
          admissionDate: data.admissionDate,
          clubs: data.clubs || [],
          hobbies: data.hobbies || [],
        };

        setProfile(transformedProfile);
        setCurrentView('view');
      } catch (fetchError) {
        const errorStatus = fetchError.response?.status;
        const errorMessage = fetchError.response?.data?.message || fetchError.response?.data?.error || '';
        const isNotFoundError = errorStatus === 404 || 
                              (errorStatus === 400 && errorMessage.toLowerCase().includes('not found')) ||
                              errorMessage.toLowerCase().includes('no student found');
        
        if (isNotFoundError) {
          // Initialize empty profile for new student
          setProfile(prev => ({
            ...prev,
            email: user.email,
            fullName: user.fullName || user.username || '',
            studentId: `STU${new Date().getFullYear()}${String(Math.floor(Math.random() * 10000)).padStart(4, '0')}`,
            admissionDate: new Date().toISOString().split('T')[0],
            academicYear: `${new Date().getFullYear()}-${new Date().getFullYear() + 1}`,
          }));
          setCurrentView('create');
        } else {
          throw fetchError;
        }
      }
    } catch (err) {
      console.error('Error fetching profile:', err);
      setError(err.response?.data?.error || err.message || 'Failed to load profile data.');
      setCurrentView('error');
    }
  }, [isAuthenticated, user, getUserRole]);

  useEffect(() => {
    fetchProfileData();
  }, [fetchProfileData]);

  // ================== STEP CONTENT RENDERER ==================
  const renderStepContent = useCallback(() => {
    switch (currentStep) {
      case 1:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Personal Information</h3>
              <span className="text-sm text-blue-600">Step 1 of {STEPS.length}</span>
            </div>
            
            <div className="flex flex-col items-center gap-4 p-6 bg-linear-to-br from-blue-50 to-indigo-50 rounded-2xl border-2 border-dashed border-blue-200">
              <div className="relative">
                <div className="w-32 h-32 rounded-full bg-linear-to-br from-blue-100 to-purple-100 flex items-center justify-center overflow-hidden border-4 border-white shadow-lg">
                  {profile.profilePicture ? (
                    <img
                      src={profile.profilePicture}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User className="w-16 h-16 text-blue-400" />
                  )}
                </div>
                <label className="absolute bottom-0 right-0 p-2 bg-blue-600 text-white rounded-full cursor-pointer hover:bg-blue-700 transition-colors">
                  <Camera className="w-5 h-5" />
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleProfilePictureUpload}
                  />
                </label>
              </div>
              <div className="text-center">
                <p className="font-medium text-gray-900">{profile.fullName || user?.fullName || user?.username || 'Student'}</p>
                <p className="text-sm text-gray-600">Student ID: {profile.studentId || 'Not assigned yet'}</p>
              </div>
              <p className="text-xs text-gray-500 text-center">Click camera icon to upload new photo</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={profile.fullName}
                  onChange={(e) => handleInputChange('fullName', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  placeholder="Enter full name"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Date of Birth <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={profile.dateOfBirth}
                  onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Gender <span className="text-red-500">*</span></label>
                <select
                  value={profile.gender}
                  onChange={(e) => handleInputChange('gender', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="">Select Gender</option>
                  <option value="MALE">Male</option>
                  <option value="FEMALE">Female</option>
                  <option value="OTHER">Other</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Blood Group</label>
                <select
                  value={profile.bloodGroup}
                  onChange={(e) => handleInputChange('bloodGroup', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select Blood Group</option>
                  <option value="A_PLUS">A+</option>
                  <option value="A_MINUS">A-</option>
                  <option value="B_PLUS">B+</option>
                  <option value="B_MINUS">B-</option>
                  <option value="O_PLUS">O+</option>
                  <option value="O_MINUS">O-</option>
                  <option value="AB_PLUS">AB+</option>
                  <option value="AB_MINUS">AB-</option>
                  <option value="UNKNOWN">Unknown</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Nationality</label>
                <input
                  type="text"
                  value={profile.nationality}
                  onChange={(e) => handleInputChange('nationality', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter nationality"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Religion</label>
                <input
                  type="text"
                  value={profile.religion}
                  onChange={(e) => handleInputChange('religion', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter religion"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Category</label>
                <select
                  value={profile.category}
                  onChange={(e) => handleInputChange('category', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select Category</option>
                  <option value="GENERAL">General</option>
                  <option value="OBC">OBC</option>
                  <option value="SC">SC</option>
                  <option value="ST">ST</option>
                  <option value="OTHER">Other</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Grade/Class <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={profile.grade}
                  onChange={(e) => handleInputChange('grade', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., 10-A"
                  required
                />
              </div>
            </div>
          </motion.div>
        );

      case 2:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Contact Details</h3>
              <span className="text-sm text-blue-600">Step 2 of {STEPS.length}</span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Address <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={profile.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 h-32"
                  placeholder="Enter complete address"
                  required
                />
              </div>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    value={profile.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter phone number"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    value={profile.email || user?.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter email address"
                    required
                    disabled={!!user?.email}
                  />
                  {user?.email && (
                    <p className="text-xs text-gray-500">Linked to your account email</p>
                  )}
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Emergency Contact Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={profile.emergencyContactName}
                  onChange={(e) => handleInputChange('emergencyContactName', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter emergency contact name"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Emergency Contact Phone <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  value={profile.emergencyContactPhone}
                  onChange={(e) => handleInputChange('emergencyContactPhone', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter emergency phone number"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Emergency Relation <span className="text-red-500">*</span>
                </label>
                <select
                  value={profile.emergencyRelation}
                  onChange={(e) => handleInputChange('emergencyRelation', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="">Select Relationship</option>
                  <option value="FATHER">Father</option>
                  <option value="MOTHER">Mother</option>
                  <option value="GUARDIAN">Guardian</option>
                  <option value="SIBLING">Sibling</option>
                  <option value="OTHER">Other</option>
                </select>
              </div>
            </div>
            
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
              <div className="flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-yellow-600" />
                <p className="text-sm text-yellow-700">
                  Emergency contact information is crucial for school administration and medical emergencies.
                  Please ensure all information is accurate and up-to-date.
                </p>
              </div>
            </div>
          </motion.div>
        );

      case 3:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Family Information</h3>
              <span className="text-sm text-blue-600">Step 3 of {STEPS.length}</span>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Relation</label>
                  <select
                    value={newFamilyMember.relation}
                    onChange={(e) => setNewFamilyMember(prev => ({ ...prev, relation: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="FATHER">Father</option>
                    <option value="MOTHER">Mother</option>
                    <option value="GUARDIAN">Guardian</option>
                    <option value="SIBLING">Sibling</option>
                    <option value="OTHER">Other</option>
                  </select>
                </div>
                
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Full Name</label>
                  <input
                    type="text"
                    value={newFamilyMember.name}
                    onChange={(e) => setNewFamilyMember(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter full name"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Occupation</label>
                  <input
                    type="text"
                    value={newFamilyMember.occupation}
                    onChange={(e) => setNewFamilyMember(prev => ({ ...prev, occupation: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter occupation"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Phone</label>
                  <input
                    type="tel"
                    value={newFamilyMember.phone}
                    onChange={(e) => setNewFamilyMember(prev => ({ ...prev, phone: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter phone number"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <input
                    type="email"
                    value={newFamilyMember.email}
                    onChange={(e) => setNewFamilyMember(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter email"
                  />
                </div>
                
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={newFamilyMember.isPrimary}
                      onChange={(e) => setNewFamilyMember(prev => ({ ...prev, isPrimary: e.target.checked }))}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">Primary Contact</span>
                  </label>
                  
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={newFamilyMember.isEmergency}
                      onChange={(e) => setNewFamilyMember(prev => ({ ...prev, isEmergency: e.target.checked }))}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">Emergency Contact</span>
                  </label>
                </div>
              </div>
              
              <button
                onClick={handleAddFamilyMember}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Add Family Member
              </button>
            </div>
            
            {profile.familyMembers.length > 0 && (
              <div className="space-y-3">
                <h4 className="font-medium text-gray-900">Added Family Members</h4>
                <div className="space-y-2">
                  {profile.familyMembers.map((member) => (
                    <div key={member.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium">{member.name}</p>
                        <p className="text-sm text-gray-600">{member.relation} • {member.occupation || 'No occupation'}</p>
                      </div>
                      <button
                        onClick={() => handleRemoveFamilyMember(member.id)}
                        className="p-1 text-red-600 hover:text-red-800"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        );

      case 4:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Medical Information</h3>
              <span className="text-sm text-blue-600">Step 4 of {STEPS.length}</span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Height</label>
                <input
                  type="text"
                  value={profile.height}
                  onChange={(e) => handleInputChange('height', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., 165 cm"
                />
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Weight</label>
                <input
                  type="text"
                  value={profile.weight}
                  onChange={(e) => handleInputChange('weight', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., 55 kg"
                />
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Blood Pressure</label>
                <input
                  type="text"
                  value={profile.bloodPressure}
                  onChange={(e) => handleInputChange('bloodPressure', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., 120/80"
                />
              </div>
              
              <div className="space-y-2 md:col-span-2">
                <label className="block text-sm font-medium text-gray-700">Last Medical Checkup</label>
                <input
                  type="date"
                  value={profile.lastCheckup}
                  onChange={(e) => handleInputChange('lastCheckup', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Doctor Name</label>
                <input
                  type="text"
                  value={profile.doctorName}
                  onChange={(e) => handleInputChange('doctorName', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter doctor name"
                />
              </div>
              
              <div className="space-y-2 md:col-span-3">
                <label className="block text-sm font-medium text-gray-700">Clinic Name</label>
                <input
                  type="text"
                  value={profile.clinicName}
                  onChange={(e) => handleInputChange('clinicName', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter clinic/hospital name"
                />
              </div>
            </div>
            
            <div className="space-y-4">
              <h4 className="font-medium text-gray-900">Allergies</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Allergy Name</label>
                  <input
                    type="text"
                    value={newAllergy.name}
                    onChange={(e) => setNewAllergy(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter allergy name"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Severity</label>
                  <select
                    value={newAllergy.severity}
                    onChange={(e) => setNewAllergy(prev => ({ ...prev, severity: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="MILD">Mild</option>
                    <option value="MODERATE">Moderate</option>
                    <option value="SEVERE">Severe</option>
                  </select>
                </div>
                
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Notes</label>
                  <input
                    type="text"
                    value={newAllergy.notes}
                    onChange={(e) => setNewAllergy(prev => ({ ...prev, notes: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Additional notes"
                  />
                </div>
              </div>
              
              <button
                onClick={handleAddAllergy}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Add Allergy
              </button>
            </div>
            
            {profile.allergies.length > 0 && (
              <div className="space-y-3">
                <div className="space-y-2">
                  {profile.allergies.map((allergy) => (
                    <div key={allergy.id} className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                      <div>
                        <p className="font-medium">{allergy.name}</p>
                        <p className="text-sm text-gray-600">Severity: {allergy.severity}</p>
                        {allergy.notes && (
                          <p className="text-sm text-gray-600 mt-1">Notes: {allergy.notes}</p>
                        )}
                      </div>
                      <button
                        onClick={() => handleRemoveAllergy(allergy.id)}
                        className="p-1 text-red-600 hover:text-red-800"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        );

      case 5:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Transport Details</h3>
              <span className="text-sm text-blue-600">Step 5 of {STEPS.length}</span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Transport Mode</label>
                <select
                  value={profile.transportMode}
                  onChange={(e) => handleInputChange('transportMode', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select Mode</option>
                  <option value="SCHOOL_BUS">School Bus</option>
                  <option value="PRIVATE_VEHICLE">Private Vehicle</option>
                  <option value="PUBLIC_TRANSPORT">Public Transport</option>
                  <option value="WALKING">Walking</option>
                  <option value="OTHER">Other</option>
                </select>
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Bus Route</label>
                <input
                  type="text"
                  value={profile.busRoute}
                  onChange={(e) => handleInputChange('busRoute', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter bus route"
                />
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Bus Stop</label>
                <input
                  type="text"
                  value={profile.busStop}
                  onChange={(e) => handleInputChange('busStop', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter bus stop"
                />
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Bus Number</label>
                <input
                  type="text"
                  value={profile.busNumber}
                  onChange={(e) => handleInputChange('busNumber', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter bus number"
                />
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Driver Name</label>
                <input
                  type="text"
                  value={profile.driverName}
                  onChange={(e) => handleInputChange('driverName', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter driver name"
                />
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Driver Contact</label>
                <input
                  type="tel"
                  value={profile.driverContact}
                  onChange={(e) => handleInputChange('driverContact', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter driver contact"
                />
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Pickup Time</label>
                <input
                  type="time"
                  value={profile.pickupTime}
                  onChange={(e) => handleInputChange('pickupTime', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Drop Time</label>
                <input
                  type="time"
                  value={profile.dropTime}
                  onChange={(e) => handleInputChange('dropTime', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Transport Fee</label>
                <input
                  type="number"
                  value={profile.transportFee}
                  onChange={(e) => handleInputChange('transportFee', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter fee amount"
                />
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Fee Status</label>
                <select
                  value={profile.transportFeeStatus}
                  onChange={(e) => handleInputChange('transportFeeStatus', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="PENDING">Pending</option>
                  <option value="PAID">Paid</option>
                  <option value="OVERDUE">Overdue</option>
                </select>
              </div>
            </div>
          </motion.div>
        );

      case 6:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Achievements & Interests</h3>
              <span className="text-sm text-blue-600">Step 6 of {STEPS.length}</span>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Achievement Title</label>
                  <input
                    type="text"
                    value={newAchievement.title}
                    onChange={(e) => setNewAchievement(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter achievement title"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Type</label>
                  <select
                    value={newAchievement.type}
                    onChange={(e) => setNewAchievement(prev => ({ ...prev, type: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="ACADEMIC">Academic</option>
                    <option value="SPORTS">Sports</option>
                    <option value="ARTS">Arts</option>
                    <option value="CULTURAL">Cultural</option>
                    <option value="LEADERSHIP">Leadership</option>
                    <option value="OTHER">Other</option>
                  </select>
                </div>
                
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Level</label>
                  <select
                    value={newAchievement.level}
                    onChange={(e) => setNewAchievement(prev => ({ ...prev, level: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="SCHOOL">School</option>
                    <option value="DISTRICT">District</option>
                    <option value="STATE">State</option>
                    <option value="NATIONAL">National</option>
                    <option value="INTERNATIONAL">International</option>
                  </select>
                </div>
                
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Year</label>
                  <input
                    type="number"
                    value={newAchievement.year}
                    onChange={(e) => setNewAchievement(prev => ({ ...prev, year: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter year"
                  />
                </div>
                
                <div className="space-y-2 md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700">Description</label>
                  <textarea
                    value={newAchievement.description}
                    onChange={(e) => setNewAchievement(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter achievement description"
                    rows={3}
                  />
                </div>
                
                <div className="space-y-2 md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700">Award/Certificate</label>
                  <input
                    type="text"
                    value={newAchievement.award}
                    onChange={(e) => setNewAchievement(prev => ({ ...prev, award: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter award/certificate details"
                  />
                </div>
              </div>
              
              <button
                onClick={handleAddAchievement}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Add Achievement
              </button>
            </div>
            
            {profile.achievements.length > 0 && (
              <div className="space-y-3">
                <h4 className="font-medium text-gray-900">Added Achievements</h4>
                <div className="space-y-2">
                  {profile.achievements.map((achievement) => (
                    <div key={achievement.id} className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                      <div>
                        <p className="font-medium">{achievement.title}</p>
                        <p className="text-sm text-gray-600">{achievement.type} • {achievement.level} Level • {achievement.year}</p>
                        {achievement.description && (
                          <p className="text-sm text-gray-600 mt-1">{achievement.description}</p>
                        )}
                        {achievement.award && (
                          <p className="text-sm text-gray-600 mt-1">Award: {achievement.award}</p>
                        )}
                      </div>
                      <button
                        onClick={() => handleRemoveAchievement(achievement.id)}
                        className="p-1 text-red-600 hover:text-red-800"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            <div className="space-y-4">
              <h4 className="font-medium text-gray-900">Clubs & Hobbies</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Clubs (comma separated)</label>
                  <input
                    type="text"
                    value={profile.clubs.join(', ')}
                    onChange={(e) => handleInputChange('clubs', e.target.value.split(',').map(c => c.trim()).filter(c => c))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g., Football Club, Science Club, Debate Society"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Hobbies (comma separated)</label>
                  <input
                    type="text"
                    value={profile.hobbies.join(', ')}
                    onChange={(e) => handleInputChange('hobbies', e.target.value.split(',').map(h => h.trim()).filter(h => h))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g., Reading, Football, Painting, Coding"
                  />
                </div>
              </div>
            </div>
          </motion.div>
        );

      case 7:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Review & Submit</h3>
              <span className="text-sm text-blue-600">Step 7 of {STEPS.length}</span>
            </div>
            
            <div className="space-y-6">
              <div className="bg-linear-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-200">
                <div className="flex items-center gap-3 mb-4">
                  <CheckCircle className="w-6 h-6 text-blue-500" />
                  <h4 className="font-semibold text-gray-900">Profile Summary</h4>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <h5 className="font-medium text-gray-700 mb-2">Personal Information</h5>
                      <div className="space-y-1 text-sm">
                        <p><span className="text-gray-600">Name:</span> {profile.fullName || 'Not set'}</p>
                        <p><span className="text-gray-600">Date of Birth:</span> {formatDate(profile.dateOfBirth) || 'Not set'}</p>
                        <p><span className="text-gray-600">Gender:</span> {profile.gender || 'Not set'}</p>
                        <p><span className="text-gray-600">Grade:</span> {profile.grade || 'Not set'}</p>
                        <p><span className="text-gray-600">Blood Group:</span> {profile.bloodGroup || 'Not set'}</p>
                      </div>
                    </div>
                    
                    <div>
                      <h5 className="font-medium text-gray-700 mb-2">Contact Details</h5>
                      <div className="space-y-1 text-sm">
                        <p><span className="text-gray-600">Address:</span> {profile.address || 'Not set'}</p>
                        <p><span className="text-gray-600">Phone:</span> {profile.phone || 'Not set'}</p>
                        <p><span className="text-gray-600">Email:</span> {profile.email || 'Not set'}</p>
                        <p><span className="text-gray-600">Emergency Contact:</span> {profile.emergencyContactName || 'Not set'}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <h5 className="font-medium text-gray-700 mb-2">Family Information</h5>
                      <div className="space-y-1 text-sm">
                        <p><span className="text-gray-600">Family Members:</span> {profile.familyMembers.length} added</p>
                        <p><span className="text-gray-600">Allergies:</span> {profile.allergies.length} recorded</p>
                        <p><span className="text-gray-600">Medical Checkup:</span> {formatDate(profile.lastCheckup) || 'Not recorded'}</p>
                      </div>
                    </div>
                    
                    <div>
                      <h5 className="font-medium text-gray-700 mb-2">Transport Details</h5>
                      <div className="space-y-1 text-sm">
                        <p><span className="text-gray-600">Mode:</span> {profile.transportMode || 'Not set'}</p>
                        {profile.transportMode && (
                          <>
                            <p><span className="text-gray-600">Route:</span> {profile.busRoute || 'Not set'}</p>
                            <p><span className="text-gray-600">Fee Status:</span> {profile.transportFeeStatus}</p>
                          </>
                        )}
                      </div>
                    </div>
                    
                    <div>
                      <h5 className="font-medium text-gray-700 mb-2">Achievements & Activities</h5>
                      <div className="space-y-1 text-sm">
                        <p><span className="text-gray-600">Achievements:</span> {profile.achievements.length} added</p>
                        <p><span className="text-gray-600">Clubs:</span> {profile.clubs.length} joined</p>
                        <p><span className="text-gray-600">Hobbies:</span> {profile.hobbies.length} listed</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-green-50 border border-green-200 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <AlertCircle className="w-6 h-6 text-green-600" />
                  <h4 className="font-semibold text-green-800">Ready to Submit</h4>
                </div>
                
                <div className="space-y-3">
                  <p className="text-green-700">
                    Please review all information carefully before submitting. Once submitted, 
                    your profile will be available to school administration and you'll be able 
                    to use all student features.
                  </p>
                  
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="confirm"
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      required
                    />
                    <label htmlFor="confirm" className="text-sm text-gray-700">
                      I confirm that all information provided is accurate and complete
                    </label>
                  </div>
                </div>
              </div>
              
              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                <div className="flex items-center gap-3">
                  <AlertCircle className="w-5 h-5 text-yellow-600" />
                  <p className="text-sm text-yellow-700">
                    Note: After submission, you can still update your profile information at any time.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        );

      default:
        return null;
    }
  }, [
    currentStep,
    STEPS.length,
    profile,
    newFamilyMember,
    newAllergy,
    newAchievement,
    user,
    handleInputChange,
    handleProfilePictureUpload,
    handleAddFamilyMember,
    handleRemoveFamilyMember,
    handleAddAllergy,
    handleRemoveAllergy,
    handleAddAchievement,
    handleRemoveAchievement,
    formatDate
  ]);

  // ================== VIEW HANDLERS ==================
  const handleEditProfile = () => {
    setIsEditing(true);
    setCurrentView('create');
    setCurrentStep(1);
  };

  const handleCancelEdit = () => {
    if (profile.id) {
      setCurrentView('view');
    } else {
      navigate('/dashboard');
    }
  };

  const handleRetry = () => {
    fetchProfileData();
  };

  const handleGoBack = () => {
    navigate('/dashboard');
  };

  // ================== RENDER CURRENT VIEW ==================
  switch (currentView) {
    case 'loading':
      return <LoadingView user={user} />;
    
    case 'error':
      return (
        <ErrorView 
          error={error} 
          onRetry={handleRetry} 
          onGoBack={handleGoBack} 
        />
      );
    
    case 'create':
      return (
        <CreateEditProfileView
          profile={profile}
          isNewProfile={!profile.id}
          currentStep={currentStep}
          steps={STEPS}
          newFamilyMember={newFamilyMember}
          newAllergy={newAllergy}
          newAchievement={newAchievement}
          saving={saving}
          user={user}
          onInputChange={handleInputChange}
          onNextStep={nextStep}
          onPrevStep={prevStep}
          onSave={handleSave}
          onCancel={handleCancelEdit}
          onAddFamilyMember={handleAddFamilyMember}
          onRemoveFamilyMember={handleRemoveFamilyMember}
          onUpdateNewFamilyMember={setNewFamilyMember}
          onAddAllergy={handleAddAllergy}
          onRemoveAllergy={handleRemoveAllergy}
          onUpdateNewAllergy={setNewAllergy}
          onAddAchievement={handleAddAchievement}
          onRemoveAchievement={handleRemoveAchievement}
          onUpdateNewAchievement={setNewAchievement}
          onProfilePictureUpload={handleProfilePictureUpload}
          formatDate={formatDate}
          renderStepContent={renderStepContent}
        />
      );
    
    case 'view':
      return (
        <ViewProfileView
          profile={profile}
          user={user}
          formatDate={formatDate}
          calculateAge={calculateAge}
          getSeverityColor={getSeverityColor}
          getAchievementTypeColor={getAchievementTypeColor}
          getHobbyIcon={getHobbyIcon}
          onEditProfile={handleEditProfile}
          onGoBack={handleGoBack}
        />
      );
    
    default:
      return <LoadingView user={user} />;
  }
};

export default Profile;