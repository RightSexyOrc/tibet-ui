import { Dialog, Transition } from '@headlessui/react';
import { QRCodeSVG } from 'qrcode.react';
import React, { Fragment } from 'react';
import ReactDOM from 'react-dom';
import { createRoot } from 'react-dom/client'

let closeModalFunction: () => void = () => {};

type WalletConnectModalArgs = {
  pairingString: string
  onClose: () => void
}

const WalletConnectModal = ({ pairingString, onClose }: WalletConnectModalArgs) => {
  return ReactDOM.createPortal(
    (
        <Transition appear show={true} as={Fragment}>
            <Dialog as="div" className="relative z-20" onClose={onClose}>
              <Transition.Child
                  as={Fragment}
                  enter="ease-out duration-300"
                  enterFrom="opacity-0"
                  enterTo="opacity-100"
                  leave="ease-in duration-200"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
              >
                  <div className="fixed inset-0 bg-brandDark/10 backdrop-blur-sm" />
              </Transition.Child>
      
              <div className="fixed inset-0 overflow-y-auto">
                <div className="flex min-h-full items-center justify-center p-4 text-center">
                  <Transition.Child
                      as={Fragment}
                      enter="ease-out duration-300"
                      enterFrom="opacity-0 scale-95"
                      enterTo="opacity-100 scale-100"
                      leave="ease-in duration-200"
                      leaveFrom="opacity-100 scale-100"
                      leaveTo="opacity-0 scale-95"
                  >
                    <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white dark:bg-zinc-900 p-6 text-left align-middle shadow-xl transition-all">
                      <div className="mx-auto flex items-center">
                        <QRCodeSVG
                          value={pairingString}
                          includeMargin
                          width={300}
                          height={300}
                        />
                      </div>
                    </Dialog.Panel>
                  </Transition.Child>
                </div>
              </div>
            </Dialog>
        </Transition>
    ),
    document.body,
  )
}

export const showWalletConnectModal = (pairingString: string) => {
  const modalDiv = document.createElement('div')
  document.body.appendChild(modalDiv)

  const root = createRoot(modalDiv)
  const onClose = () => {
    root.unmount()
    document.body.removeChild(modalDiv)
  }

  root.render(
    <WalletConnectModal
      pairingString={pairingString}
      onClose={onClose}
    />,
  )

  return onClose
};

export const closeWalletConnectModal = () => {
  if (closeModalFunction) {
    closeModalFunction()
  }
};
