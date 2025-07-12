"use client";
import React from "react";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalTrigger,
} from "./animated-modal-base";

export function AnimatedModalConfirmation() {
  return (
    <div className="py-40 flex items-center justify-center">
      <Modal>
        <ModalTrigger className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-colors">
          Delete Item
        </ModalTrigger>
        <ModalBody className="md:max-w-[30%]">
          <ModalContent>
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mb-4">
                <svg
                  className="w-8 h-8 text-red-600 dark:text-red-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>
              
              <h4 className="text-xl font-bold text-neutral-800 dark:text-neutral-100 mb-2">
                Are you sure?
              </h4>
              
              <p className="text-neutral-600 dark:text-neutral-400 mb-6">
                This action cannot be undone. This will permanently delete your item
                and remove all associated data.
              </p>
            </div>
          </ModalContent>
          <ModalFooter className="justify-center gap-3">
            <button className="px-6 py-2 border border-neutral-300 dark:border-neutral-700 rounded-md text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors">
              Cancel
            </button>
            <button className="px-6 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors">
              Delete
            </button>
          </ModalFooter>
        </ModalBody>
      </Modal>
    </div>
  );
}