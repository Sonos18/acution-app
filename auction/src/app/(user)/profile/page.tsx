"use client";

import React, { useState } from "react";
import { Switch } from "@/components/ui/switch";
import {
  FaSquareFacebook,
  FaSquareTwitter,
  FaInstagram,
} from "react-icons/fa6";
import Image from "next/image";
import { useAppContext } from "../../app-provider";
import Link from "next/link";
import { SheetEditProfile } from "@/components/custom/profile/sheet-edit-profile";

const Profile = () => {
  const { user } = useAppContext();
  const [isChecked, setChecked] = useState(false);
  return (
    <div className="flex-grow">
      <div className="mx-auto w-5/6 ease-soft-in-out xl:ml-68.5 h-full max-h-screen bg-gray-50 transition-all duration-200">
        <div className="w-full px-6 mx-auto bg-gray-100">
          <div className="bg-zinc-500 relative flex items-center p-0 mt-6 overflow-hidden bg-center bg-cover min-h-75 rounded-2xl">
            <div className="w-full h-80">
              <Image
                src={
                  user?.avatar ??
                  "https://demos.creative-tim.com/soft-ui-dashboard-tailwind/assets/img/team-4.jpg"
                }
                alt="profile_image"
                layout="fill"
                objectFit="cover"
                className="object-cover shadow-soft-sm rounded-xl"
              />
            </div>
            {isChecked && (
              <span className="absolute inset-y-0 w-full h-full bg-center bg-cover bg-gradient-to-tl from-purple-700 to-pink-500 opacity-60"></span>
            )}
          </div>
          <div className="relative flex flex-col flex-auto min-w-0 p-4 mx-6 -mt-16 overflow-hidden break-words border-0 shadow-blur rounded-2xl bg-white/80 bg-clip-border backdrop-blur-2xl backdrop-saturate-200">
            <div className="flex flex-wrap -mx-3">
              <div className="flex-none w-auto max-w-full px-3">
                <div className="text-base ease-soft-in-out h-18.5 w-18.5 relative inline-flex items-center justify-center rounded-xl text-white transition-all duration-200">
                  <div className="w-16 h-16">
                    <Image
                      src={
                        user?.avatar ??
                        "https://demos.creative-tim.com/soft-ui-dashboard-tailwind/assets/img/team-4.jpg"
                      }
                      layout="fill"
                      objectFit="cover"
                      alt="profile_image"
                      className="shadow-soft-sm rounded-xl"
                    />
                  </div>
                </div>
              </div>
              <div className="flex-none w-auto max-w-full px-3 my-auto">
                <div className="h-full">
                  <h5 className="mb-1">
                    {user?.firstName} {user?.lastName}
                  </h5>
                  <p className="mb-0 font-semibold leading-normal text-sm">
                    Users
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="w-full p-6 mx-auto bg-gray-100">
          <div className="flex flex-wrap -mx-3">
            <div className="w-full max-w-full px-3 xl:w-4/12">
              <div className="relative flex flex-col h-full min-w-0 break-words bg-white border-b-2 shadow-soft-xl rounded-2xl bg-clip-border">
                <div className="p-4 pb-0 mb-0 bg-white border-b-0 rounded-t-2xl">
                  <h6 className="mb-0">Settings</h6>
                </div>
                <div className="flex-auto p-4">
                  <h6 className="font-bold leading-tight uppercase text-xs text-slate-500">
                    Account
                  </h6>
                  <ul className="flex flex-col pl-0 mb-0 rounded-lg">
                    <li className="relative block px-0 py-2 bg-white border-0 rounded-t-lg text-inherit">
                      <div className="min-h-6 mb-0.5 block pl-0">
                        <Switch
                          id="follow"
                          className="mt-0.54 rounded-10 duration-250 h-5 float-left ml-auto w-10 align-top transition-all"
                        />
                        <label
                          htmlFor="follow"
                          className="w-4/5 mb-0 ml-4 overflow-hidden font-normal cursor-pointer select-none text-sm text-ellipsis whitespace-nowrap text-slate-500"
                        >
                          Email me when someone follows me
                        </label>
                      </div>
                    </li>
                    <li className="relative block px-0 py-2 bg-white border-0 text-inherit">
                      <div className="min-h-6 mb-0.5 block pl-0">
                        <Switch
                          id="follow"
                          className="mt-0.54 rounded-10 duration-250 h-5 float-left ml-auto w-10 align-top transition-all"
                        />
                        <label
                          htmlFor="answer"
                          className="my-auto w-4/5 ml-4 overflow-hidden font-normal cursor-pointer select-none text-sm text-ellipsis whitespace-nowrap text-slate-500"
                        >
                          Email me when someone answers on my post
                        </label>
                      </div>
                    </li>
                    <li className="relative block px-0 py-2 bg-white border-0 rounded-b-lg text-inherit">
                      <div className="min-h-6 mb-0.5 block pl-0 justify-center items-center">
                        <Switch
                          id="mention"
                          checked={isChecked}
                          onCheckedChange={setChecked}
                          className="mt-0.54 rounded-10 duration-250 h-5 float-left ml-auto w-10 align-top transition-all"
                        />
                        <label
                          htmlFor="mention"
                          className="w-4/5 mb-0 ml-4 overflow-hidden font-normal cursor-pointer select-none text-sm text-ellipsis whitespace-nowrap text-slate-500"
                        >
                          Email me when someone mentions me
                        </label>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="w-full max-w-full px-3 lg-max:mt-6 xl:w-4/12">
              <div className="relative flex flex-col h-full min-w-0 break-words bg-white border-0 shadow-soft-xl rounded-2xl bg-clip-border">
                <div className="p-4 pb-0 mb-0 bg-white border-b-0 rounded-t-2xl">
                  <div className="flex justify-between items-center w-full max-w-full px-3">
                    <h6 className="mb-0">Profile Information</h6>
                    <div className="text-blue-500 hover:cursor-pointer">
                      <SheetEditProfile />
                    </div>
                  </div>
                </div>
                <div className="flex-auto p-4">
                  <p className="leading-normal text-sm">
                    Hi, I’m {user?.firstName} {user?.lastName}, Decisions: If you can’t decide, the
                    answer is no. If two equally difficult paths, choose the one
                    more painful in the short term (pain avoidance is creating
                    an illusion of equality).
                  </p>
                  <hr className="h-px my-6 bg-transparent bg-gradient-to-r from-transparent via-white to-transparent" />
                  <ul className="flex flex-col pl-0 mb-0 rounded-lg">
                    <li className="relative block px-4 py-2 pt-0 pl-0 leading-normal bg-white border-0 rounded-t-lg text-sm text-inherit">
                      <strong className="text-slate-700">Full Name:</strong>{" "}
                      &nbsp; {user?.firstName} {user?.lastName}
                    </li>
                    <li className="relative block px-4 py-2 pl-0 leading-normal bg-white border-0 border-t-0 text-sm text-inherit">
                      <strong className="text-slate-700">Mobile:</strong> &nbsp;
                      {user?.phone ?? "Not update"}
                    </li>
                    <li className="relative block px-4 py-2 pl-0 leading-normal bg-white border-0 border-t-0 text-sm text-inherit">
                      <strong className="text-slate-700">Email:</strong> &nbsp;
                      {user?.email}
                    </li>
                    <li className="relative block px-4 py-2 pl-0 leading-normal bg-white border-0 border-t-0 text-sm text-inherit">
                      <strong className="text-slate-700">Location:</strong>{" "}
                      &nbsp; Vietnam
                    </li>
                    <li className="relative block px-4 py-2 pb-0 pl-0 bg-white border-0 border-t-0 rounded-b-lg text-inherit">
                      <strong className="leading-normal text-sm text-slate-700">
                        Social:
                      </strong>{" "}
                      &nbsp;
                      <a
                        className="inline-block py-0 pl-1 pr-2 mb-0 font-bold text-center text-blue-800 align-middle transition-all bg-transparent border-0 rounded-lg shadow-none cursor-pointer leading-pro text-xs ease-soft-in bg-none"
                        href="javascript:;"
                      >
                        <FaSquareFacebook size="32" />
                      </a>
                      <a
                        className="inline-block py-0 pl-1 pr-2 mb-0 font-bold text-center align-middle transition-all bg-transparent border-0 rounded-lg shadow-none cursor-pointer leading-pro text-xs ease-soft-in bg-none text-sky-600"
                        href="javascript:;"
                      >
                        <FaSquareTwitter size="32" />
                      </a>
                      <a
                        className="inline-block py-0 pl-1 pr-2 mb-0 font-bold text-center align-middle transition-all bg-transparent border-0 rounded-lg shadow-none cursor-pointer leading-pro text-xs ease-soft-in bg-none text-sky-900"
                        href="javascript:;"
                      >
                        <FaInstagram size="32" />
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="w-full max-w-full px-3 lg-max:mt-6 xl:w-4/12">
              <div className="relative flex flex-col h-full min-w-0 break-words bg-white border-0 shadow-soft-xl rounded-2xl bg-clip-border">
                <div className="p-4 pb-0 mb-0 bg-white border-b-0 rounded-t-2xl">
                  <h6 className="mb-0">Conversations</h6>
                </div>
                <div className="flex-auto p-4">
                  <ul className="flex flex-col pl-0 mb-0 rounded-lg">
                    <li className="relative flex items-center px-0 py-2 mb-2 bg-white border-0 rounded-t-lg text-inherit">
                      <div className="inline-flex items-center justify-center w-12 h-12 mr-4 text-white transition-all duration-200 text-base ease-soft-in-out rounded-xl">
                        <img
                          src="https://demos.creative-tim.com/soft-ui-dashboard-tailwind/assets/img/bruce-mars.jpg"
                          alt="kal"
                          className="w-full shadow-soft-2xl rounded-xl"
                        />
                      </div>
                      <div className="flex flex-col items-start justify-center">
                        <h6 className="mb-0 leading-normal text-sm">
                          Sophie B.
                        </h6>
                        <p className="mb-0 leading-tight text-xs">
                          Hi! I need more information..
                        </p>
                      </div>
                      <a
                        className="inline-block py-3 pl-0 pr-4 mb-0 ml-auto font-bold text-center uppercase align-middle transition-all bg-transparent border-0 rounded-lg shadow-none cursor-pointer leading-pro text-xs ease-soft-in hover:scale-102 hover:active:scale-102 active:opacity-85 text-fuchsia-500 hover:text-fuchsia-800 hover:shadow-none active:scale-100"
                        href="javascript:;"
                      >
                        Reply
                      </a>
                    </li>
                    <li className="relative flex items-center px-0 py-2 mb-2 bg-white border-0 border-t-0 text-inherit">
                      <div className="inline-flex items-center justify-center w-12 h-12 mr-4 text-white transition-all duration-200 text-base ease-soft-in-out rounded-xl">
                        <img
                          src="https://demos.creative-tim.com/soft-ui-dashboard-tailwind/assets/img/marie.jpg"
                          alt="kal"
                          className="w-full shadow-soft-2xl rounded-xl"
                        />
                      </div>
                      <div className="flex flex-col items-start justify-center">
                        <h6 className="mb-0 leading-normal text-sm">
                          Anne Marie
                        </h6>
                        <p className="mb-0 leading-tight text-xs">
                          Awesome work, can you..
                        </p>
                      </div>
                      <a
                        className="inline-block py-3 pl-0 pr-4 mb-0 ml-auto font-bold text-center uppercase align-middle transition-all bg-transparent border-0 rounded-lg shadow-none cursor-pointer leading-pro text-xs ease-soft-in hover:scale-102 hover:active:scale-102 active:opacity-85 text-fuchsia-500 hover:text-fuchsia-800 hover:shadow-none active:scale-100"
                        href="javascript:;"
                      >
                        Reply
                      </a>
                    </li>
                    <li className="relative flex items-center px-0 py-2 mb-2 bg-white border-0 border-t-0 text-inherit">
                      <div className="inline-flex items-center justify-center w-12 h-12 mr-4 text-white transition-all duration-200 text-base ease-soft-in-out rounded-xl">
                        <img
                          src="https://demos.creative-tim.com/soft-ui-dashboard-tailwind/assets/img/ivana-square.jpg"
                          alt="kal"
                          className="w-full shadow-soft-2xl rounded-xl"
                        />
                      </div>
                      <div className="flex flex-col items-start justify-center">
                        <h6 className="mb-0 leading-normal text-sm">Ivanna</h6>
                        <p className="mb-0 leading-tight text-xs">
                          About files I can..
                        </p>
                      </div>
                      <a
                        className="inline-block py-3 pl-0 pr-4 mb-0 ml-auto font-bold text-center uppercase align-middle transition-all bg-transparent border-0 rounded-lg shadow-none cursor-pointer leading-pro text-xs ease-soft-in hover:scale-102 hover:active:scale-102 active:opacity-85 text-fuchsia-500 hover:text-fuchsia-800 hover:shadow-none active:scale-100"
                        href="javascript:;"
                      >
                        Reply
                      </a>
                    </li>
                    <li className="relative flex items-center px-0 py-2 mb-2 bg-white border-0 border-t-0 text-inherit">
                      <div className="inline-flex items-center justify-center w-12 h-12 mr-4 text-white transition-all duration-200 text-base ease-soft-in-out rounded-xl">
                        <img
                          src="https://demos.creative-tim.com/soft-ui-dashboard-tailwind/assets/img/team-4.jpg"
                          alt="kal"
                          className="w-full shadow-soft-2xl rounded-xl"
                        />
                      </div>
                      <div className="flex flex-col items-start justify-center">
                        <h6 className="mb-0 leading-normal text-sm">
                          Peterson
                        </h6>
                        <p className="mb-0 leading-tight text-xs">
                          Have a great afternoon..
                        </p>
                      </div>
                      <a
                        className="inline-block py-3 pl-0 pr-4 mb-0 ml-auto font-bold text-center uppercase align-middle transition-all bg-transparent border-0 rounded-lg shadow-none cursor-pointer leading-pro text-xs ease-soft-in hover:scale-102 hover:active:scale-102 active:opacity-85 text-fuchsia-500 hover:text-fuchsia-800 hover:shadow-none active:scale-100"
                        href="javascript:;"
                      >
                        Reply
                      </a>
                    </li>
                    <li className="relative flex items-center px-0 py-2 bg-white border-0 border-t-0 rounded-b-lg text-inherit">
                      <div className="inline-flex items-center justify-center w-12 h-12 mr-4 text-white transition-all duration-200 text-base ease-soft-in-out rounded-xl">
                        <img
                          src="https://demos.creative-tim.com/soft-ui-dashboard-tailwind/assets/img/team-3.jpg"
                          alt="kal"
                          className="w-full shadow-soft-2xl rounded-xl"
                        />
                      </div>
                      <div className="flex flex-col items-start justify-center">
                        <h6 className="mb-0 leading-normal text-sm">
                          Nick Daniel
                        </h6>
                        <p className="mb-0 leading-tight text-xs">
                          Hi! I need more information..
                        </p>
                      </div>
                      <a
                        className="inline-block py-3 pl-0 pr-4 mb-0 ml-auto font-bold text-center uppercase align-middle transition-all bg-transparent border-0 rounded-lg shadow-none cursor-pointer leading-pro text-xs ease-soft-in hover:scale-102 hover:active:scale-102 active:opacity-85 text-fuchsia-500 hover:text-fuchsia-800 hover:shadow-none active:scale-100"
                        href="javascript:;"
                      >
                        Reply
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="h-40"></div>
    </div>
  );
};
export default Profile;
