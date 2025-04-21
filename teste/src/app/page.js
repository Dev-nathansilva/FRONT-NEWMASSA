import { HStack, Button, CloseButton, Dialog, Portal } from "@chakra-ui/react";

export default function Home() {
  return (
    <div>
      {" "}
      <HStack>
        <Button className="text-[50px]" colorPalette="red" variant="solid">
          Click me
        </Button>
        <Button>Click me</Button>
      </HStack>
      <div className="text-[50px]">nathan</div>
      <Dialog.Root size="cover" motionPreset="slide-in-bottom">
        <Dialog.Trigger asChild>
          <Button variant="outline" size="sm">
            Open Dialog
          </Button>
        </Dialog.Trigger>
        <Portal>
          <Dialog.Backdrop />
          <Dialog.Positioner>
            <Dialog.Content>
              <Dialog.Header>
                <Dialog.Title>Dialog Title</Dialog.Title>
              </Dialog.Header>
              <Dialog.Body>
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
                  do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                </p>
              </Dialog.Body>
              <Dialog.Footer>
                <Dialog.ActionTrigger asChild>
                  <Button variant="outline">Cancel</Button>
                </Dialog.ActionTrigger>
                <Button>Save</Button>
              </Dialog.Footer>
              <Dialog.CloseTrigger asChild>
                <CloseButton size="sm" />
              </Dialog.CloseTrigger>
            </Dialog.Content>
          </Dialog.Positioner>
        </Portal>
      </Dialog.Root>
    </div>
  );
}
