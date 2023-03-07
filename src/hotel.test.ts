import { Controller, Hotel, MotionEvent } from "./hotel"

describe ('Hotel', () => {
    it ('should be created', () => {
        const hotel = new Hotel("Hotel")
        expect(hotel).toBeDefined()
    })
    it ('should trigger an event to be caught by Camera Main Corridor 1', () => {
        const hotel = new Hotel("Hotel")
        const movementInMainCorridor1Event =
            new MotionEvent("Main Corridor 1",new Date())
        const spy = jest.spyOn(hotel, 'receiveEvent')
            const controller = new Controller(hotel)
        controller.broadcast(movementInMainCorridor1Event)
        expect(spy).toHaveBeenCalledWith(movementInMainCorridor1Event)
    })
    it.only ('should trigger an event to be caught by Camera Sub Corridor 22', () => {
        const hotel = new Hotel("SuperHotel")
        const movementInMainCorridor1Event =
            new MotionEvent("Sub Corridor 22",new Date())
        const spy = jest.spyOn(hotel, 'receiveEvent')
            const controller = new Controller(hotel)
        controller.broadcast(movementInMainCorridor1Event)
        controller.displayStatus()
        expect(spy).toHaveBeenCalledWith(movementInMainCorridor1Event)
    })

})