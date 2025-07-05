"use client";
import React from "react";
import { Modal, ModalTrigger, ModalBody, ModalContent, ModalFooter } from "./animated-modal-base";

// Gallery-specific preview components with consistent sizing
export function AnimatedModalGalleryBasic() {
  return (
    <div className="flex items-center justify-center p-8 h-[32rem]">
      <Modal>
        <ModalTrigger className="bg-black dark:bg-white dark:text-black text-white flex justify-center group/modal-btn">
          <span className="group-hover/modal-btn:translate-x-40 text-center transition duration-500">
            Open Modal
          </span>
          <div className="-translate-x-40 group-hover/modal-btn:translate-x-0 flex items-center justify-center absolute inset-0 transition duration-500 text-white z-20">
            ✨
          </div>
        </ModalTrigger>
        <ModalBody>
          <ModalContent>
            <h4 className="text-lg md:text-2xl text-neutral-600 dark:text-neutral-100 font-bold text-center mb-8">
              Beautiful Animated Modal
            </h4>
            <div className="flex justify-center items-center">
              <div className="w-40 h-40 bg-gradient-to-r from-violet-500 to-purple-500 rounded-lg flex items-center justify-center">
                <div className="text-white text-4xl">🎨</div>
              </div>
            </div>
            <p className="text-neutral-600 dark:text-neutral-300 text-sm md:text-base text-center mt-8">
              This is a smooth animated modal with 3D transformations and backdrop blur effects.
            </p>
          </ModalContent>
          <ModalFooter className="gap-4">
            <button className="px-2 py-1 bg-gray-200 text-black dark:bg-neutral-800 dark:border-neutral-700 dark:text-white border border-gray-300 rounded-md text-sm w-28">
              Cancel
            </button>
            <button className="bg-black text-white dark:bg-white dark:text-black text-sm px-2 py-1 rounded-md border border-black w-28">
              Confirm
            </button>
          </ModalFooter>
        </ModalBody>
      </Modal>
    </div>
  );
}

export function AnimatedModalGalleryForm() {
  return (
    <div className="flex items-center justify-center p-8 h-[32rem]">
      <Modal>
        <ModalTrigger className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition duration-200">
          Contact Form
        </ModalTrigger>
        <ModalBody>
          <ModalContent>
            <h4 className="text-lg md:text-2xl text-neutral-600 dark:text-neutral-100 font-bold text-center mb-8">
              Get in Touch
            </h4>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-neutral-600 dark:text-neutral-300 mb-2">
                  Name
                </label>
                <input 
                  type="text" 
                  className="w-full p-2 border border-gray-300 dark:border-neutral-700 rounded-md bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100"
                  placeholder="Your name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-600 dark:text-neutral-300 mb-2">
                  Email
                </label>
                <input 
                  type="email" 
                  className="w-full p-2 border border-gray-300 dark:border-neutral-700 rounded-md bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100"
                  placeholder="your@email.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-600 dark:text-neutral-300 mb-2">
                  Message
                </label>
                <textarea 
                  rows={3}
                  className="w-full p-2 border border-gray-300 dark:border-neutral-700 rounded-md bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100"
                  placeholder="Your message..."
                />
              </div>
            </div>
          </ModalContent>
          <ModalFooter className="gap-4">
            <button className="px-4 py-2 bg-gray-200 text-black dark:bg-neutral-800 dark:text-white border border-gray-300 dark:border-neutral-700 rounded-md text-sm">
              Cancel
            </button>
            <button className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2 rounded-md transition duration-200">
              Send Message
            </button>
          </ModalFooter>
        </ModalBody>
      </Modal>
    </div>
  );
}

export function AnimatedModalGalleryConfirmation() {
  return (
    <div className="flex items-center justify-center p-8 h-[32rem]">
      <Modal>
        <ModalTrigger className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg transition duration-200">
          Delete Item
        </ModalTrigger>
        <ModalBody>
          <ModalContent>
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mb-4">
                <div className="text-red-600 text-2xl">⚠️</div>
              </div>
              <h4 className="text-lg md:text-xl text-neutral-600 dark:text-neutral-100 font-bold mb-4">
                Confirm Deletion
              </h4>
              <p className="text-neutral-600 dark:text-neutral-300 text-sm md:text-base">
                Are you sure you want to delete this item? This action cannot be undone.
              </p>
            </div>
          </ModalContent>
          <ModalFooter className="gap-4">
            <button className="px-4 py-2 bg-gray-200 text-black dark:bg-neutral-800 dark:text-white border border-gray-300 dark:border-neutral-700 rounded-md text-sm">
              Cancel
            </button>
            <button className="bg-red-600 hover:bg-red-700 text-white text-sm px-4 py-2 rounded-md transition duration-200">
              Delete
            </button>
          </ModalFooter>
        </ModalBody>
      </Modal>
    </div>
  );
}

export function AnimatedModalGalleryMinimal() {
  return (
    <div className="flex items-center justify-center p-8 h-[32rem]">
      <Modal>
        <ModalTrigger className="bg-gray-800 hover:bg-gray-900 text-white px-4 py-2 rounded-md transition duration-200">
          Minimal Modal
        </ModalTrigger>
        <ModalBody>
          <ModalContent>
            <h4 className="text-lg text-neutral-600 dark:text-neutral-100 font-semibold text-center mb-6">
              Simple & Clean
            </h4>
            <div className="flex justify-center">
              <div className="w-24 h-24 bg-gradient-to-br from-gray-400 to-gray-600 rounded-full"></div>
            </div>
            <p className="text-neutral-600 dark:text-neutral-300 text-sm text-center mt-6">
              Minimal design with essential elements only.
            </p>
          </ModalContent>
        </ModalBody>
      </Modal>
    </div>
  );
}