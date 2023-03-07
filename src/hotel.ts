// Hotel Management System
// A hotel has multiple floors. Each floor has multiple main corridors and sub corridors.
// Both the main corridor and sub corridor have one light and one camera each.
// The light in the main corridor is always ON.
// The light in the sub corridor must be turned on when motion is detected.
// All the cameras are switched off by default.
//
// MotionEvent captured the location of the corridor and the time of the event.
// When a light is notified, it checks the location of the event and turns on the light if the location matches.
// When a camera is notified, it checks the location of the event and turns on the camera if the location matches.
// The hotel management system should be able to print the status of all the lights and cameras in the hotel.
//
// Corridors are the subjects under observation.
// Light and Camera are the observers.
// The controller simulates sensors by broadcasting motion events to the hotel management system. 
// The hotel management system then passes on the message to the hotel.
// The event is then cascaded down the class structure of a hotel such as floors and corridors.

export class MotionEvent {
    constructor(readonly _location: string, readonly _time: Date) {
    }
}

interface ISubscriber {
    notify(anEvent: MotionEvent) : void
}

// A motion sensor is installed in each subject under observation
abstract class SubjectUnderObservation {
    private subscribers: ISubscriber[] = []
    public addSubscriber(subscriber: ISubscriber) : void {
        this.subscribers.push(subscriber)
    }
    public removeSubscriber(subscriber: ISubscriber) : void {
        this.subscribers = this.subscribers.filter(s => s !== subscriber)
    }
    public notifySubscribers(anEvent: MotionEvent) : void {
console.log(`abstract class receiveEvent: ${anEvent._location}`)
        this.subscribers.forEach(s => s.notify(anEvent))
    }   
}


export class Hotel {
    private _name: string
    private _floors: Floor[]
    constructor (name: string) {
        this._name = name
        this._floors = []
    }
    public addFloor(floor: Floor) : void {
        this._floors.push(floor)
    }
    public receiveEvent(anEvent: MotionEvent) : void {
console.log(`name ${this._name} receiveEvent: ${anEvent._location}`)
        this._floors.forEach(f => f.receiveEvent(anEvent))
    }
    public log() : void {
        console.log(`Hotel ${this._name} :`)
        this._floors.forEach(f => f.log())
    }

}

class Floor {
    private _mainCorridors: MainCorridor[]
    private _subCorridors: SubCorridor[]
    constructor(private _name: string) {
        this._mainCorridors = []
        this._subCorridors = []     
    }    
    public addMainCorridor(mainCorridor: MainCorridor) : void {
        this._mainCorridors.push(mainCorridor)
    }
    public addSubCorridor(subCorridor: SubCorridor) : void {
        this._subCorridors.push(subCorridor)
    }
    public receiveEvent(anEvent: MotionEvent) : void {
console.log(`name ${this._name} receiveEvent: ${anEvent._location}`)
        this._mainCorridors.forEach(m => m.receiveEvent(anEvent))
        this._subCorridors.forEach(s => s.receiveEvent(anEvent))
    }
    public log() : void {
        console.log(`Floor ${this._name} :`)
        this._mainCorridors.forEach(f => f.log())
        this._subCorridors.forEach(f => f.log())

    }

}

abstract class Corridor extends SubjectUnderObservation{
    constructor(private _name: string,
                private _light: Light,
                private _camera: Camera) {
        super()
        this.addSubscriber(_light)
        this.addSubscriber(_camera)
    }
    public log() : void {
        console.log(`${this._name} :`)
        this._light.log()
        this._camera.log()
    }
    public receiveEvent(anEvent: MotionEvent) : void {
console.log(`name ${this._name} receiveEvent: ${anEvent._location}`)
        this.notifySubscribers(anEvent)
    }
    // public notify(anEvent: MotionEvent) : void {
    //     this._light.notify(anEvent)
    //     this._camera.notify(anEvent)
    // }
}

class MainCorridor extends Corridor{
    constructor(name: string, light: Light, camera: Camera) {
        super(name, light, camera)
    }
    public log(): void {
        console.log(`Main Corridor ...`)
        super.log()
    }
    
}

class SubCorridor extends Corridor{
    constructor(name: string, light: Light, camera: Camera) {
        super(name, light, camera)
    }
    public log(): void {
        console.log(`Sub Corridor ...`)
        super.log()
    }
}

class Light implements ISubscriber{
    constructor(private _name: string,
                private _on: boolean) {  
    }
    public log() : void {
        console.log(`Logger: Light ${this._name} - ${this._on ? 'ON' : 'OFF'}`)
    }
    public notify(anEvent: MotionEvent) : void {
        if (anEvent._location === this._name) {
            this._on = true
            setTimeout(() => {
                this._on = false
            }, 5000);
        }
console.log(`Light ${this._name} notify: ${anEvent._location} ${this._on}`)
    }
    
}

class Camera implements ISubscriber{
    constructor(private _name: string,
                private _show: boolean) {
    }
    public log() : void {
        console.log(`Logger: Camera ${this._name} - ${this._show ? 'SHOW' : 'HIDE'}`)
    }
    public notify(anEvent: MotionEvent) : void {
        if (anEvent._location === this._name) {
            this._show = true
        }
console.log(`Camera ${this._name} notify: ${anEvent._location} ${this._show}`)
    }
}

export class Controller {
    private _hotel: Hotel
    constructor(hotel: Hotel) {
        this._hotel = hotel
        const mc1_light = new Light("Main Corridor 1",true)
        const mc1_camera = new Camera("Main Corridor 1",false)
        const mc1_floor = new MainCorridor("Main Corridor 1",mc1_light,mc1_camera)
        
        const sc11_light = new Light("Sub Corridor 11",false)
        const sc11_camera = new Camera("Sub Corridor 11",false)
        const sc11_floor = new SubCorridor("Sub Corridor 11",sc11_light,sc11_camera)
        
        const sc12_light = new Light("Sub Corridor 12",false)
        const sc12_camera = new Camera("Sub Corridor 12",false)
        const sc12_floor = new SubCorridor("Sub Corridor 12",sc12_light,sc12_camera)
        
        const floor1 = new Floor("Floor 1")
        floor1.addMainCorridor(mc1_floor)
        floor1.addSubCorridor(sc11_floor)
        floor1.addSubCorridor(sc12_floor)

        const mc2_light = new Light("Main Corridor 2",true)
        const mc2_camera = new Camera("Main Corridor 2",false)
        const mc2_floor = new MainCorridor("Main Corridor 1",mc2_light,mc2_camera)
        
        const sc21_light = new Light("Sub Corridor 21",false)
        const sc21_camera = new Camera("Sub Corridor 21",false)
        const sc21_floor = new SubCorridor("Sub Corridor 21",sc21_light,sc21_camera)
        
        const sc22_light = new Light("Sub Corridor 22",false)
        const sc22_camera = new Camera("Sub Corridor 22",false)
        const sc22_floor = new SubCorridor("Sub Corridor 22",sc22_light,sc22_camera)

        const floor2 = new Floor("Floor 2")
        floor2.addMainCorridor(mc2_floor)
        floor2.addSubCorridor(sc21_floor)
        floor2.addSubCorridor(sc22_floor)
        
        hotel.addFloor(floor1)
        hotel.addFloor(floor2)

    }
    public broadcast(anEvent: MotionEvent) : void {
        console.log(`Event: ${anEvent._location} at ${anEvent._time}`)
        this._hotel.receiveEvent(anEvent)
    }
    public monitor() : void {
        setInterval(() => {
            this._hotel.log()
        }, 5000)
    }
    public displayStatus() : void {
        this._hotel.log()
    }
}