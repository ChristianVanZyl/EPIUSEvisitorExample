// This command line application's purpose is to showcase 
// how the composite and visitor pattern can be used together
// to add additional functionality to classes without adjusting 
// the structure of the classes or by polluting the composite 
class Visitor {
    constructor() {
    }
    enter_kit(o) { }
    exit_kit(o) { }
    enter_collection(o) { }
    exit_collection(o) { }
    visit_gear(o) { }
    visit_camera(o) { }
    visit_lenses(o) { }
    visit_highspeed(o) { }
}


// Adjust prices for all gear items permanently 
// The price adjustment percentage must be given as a decimal i.e. 0.10 equals 10%
class AdjustPriceVisitor extends Visitor {
    constructor(discountPerc, operator) {
        super();
        this.discountPerc = discountPerc
        this.operator = operator
    }

    visit_camera(o) {
        if (this.operator === "+") {
            o.price = o.price + o.price * this.discountPerc

        } else {
            o.price = o.price - o.price * this.discountPerc
        }
    }

    visit_lenses(o) {
        if (this.operator === "+") {
            o.price = o.price + o.price * this.discountPerc
        } else {
            o.price = o.price - o.price * this.discountPerc
        }
    }

    visit_highspeed(o) {
        if (this.operator === "+") {
            o.price = o.price + o.price * this.discountPerc
        } else {
            o.price = o.price - o.price * this.discountPerc
        }
    }
}


// Calculates discounted price for renting a kit instead of individual items from inventory 
// getTotals method returns an array with objects, objects represent each kit, containts total discount before and total after change applied
// The discount percentage must be given as a decimal i.e. 0.10 equals 10%
class KitDiscountVisitor extends Visitor {
    constructor(discountPerc) {
        super();
        this.discountPerc = discountPerc
        this.totalBefore = 0
        this.totalAfter = 0
        this.arr = []
        this.current = false
    }

    enter_kit(o) {
        this.totalBefore = 0
        this.totalAfter = 0
    }


    visit_camera(o) {
        this.totalBefore = this.totalBefore + o.price
        this.totalAfter = this.totalAfter + o.price - (o.price * this.discountPerc)
    }

    visit_lenses(o) {
        this.totalBefore = this.totalBefore + o.price
        this.totalAfter = this.totalAfter + o.price - (o.price * this.discountPerc)
    }

    visit_highspeed(o) {

        this.totalBefore = this.totalBefore + o.price
        this.totalAfter = this.totalAfter + o.price - (o.price * this.discountPerc)

    }

    exit_kit(o) {
        this.arr.push({ "totalBefore": this.totalBefore, "totalAfter": this.totalAfter })
    }

    getTotals() {
        return this.arr;
    }
}



// Base
class Gear {
    constructor() {
    }
    accept(visitor) {
        visitor.visit_gear(this);
    }
}

// Composite 
class GearCollection extends Gear {
    constructor(...list) {
        super();
        this.list = list;
    }

    accept(visitor) {
        visitor.enter_collection(this);
        for (let list of this.list) {
            list.accept(visitor);
        }
        visitor.exit_collection(this);
    }
}


// Composite 
class Kit extends Gear {
    constructor(name, ...list) {
        super();
        this.name = name
        this.list = list
    }

    accept(visitor) {
        visitor.enter_kit(this);
        for (let list of this.list) {
            list.accept(visitor);
        }
        visitor.exit_kit(this);
    }
}

// Leaf, child of gear
class Camera extends Gear {
    constructor(brand, price, sensortype, resolution, dynamicrange) {
        super();
        this.brand = brand;
        this.price = price
        this.sensortype = sensortype
        this.resolution = resolution
        this.dynamicrange = dynamicrange
    }

    accept(visitor) {
        visitor.visit_camera(this);
    }
}

// Leaf, child of gear
class Lense extends Gear {
    constructor(brand, price, lensetype) {
        super()
        this.lensetype = lensetype
        this.brand = brand
        this.price = price
    }

    accept(visitor) {
        visitor.visit_lenses(this);
    }
}

// Leaf, child of camera
class HighSpeedCamera extends Camera {
    constructor(brand, price, sensortype, resolution, dynamicrange, framerate, workflowSolution) {
        super(brand, price, sensortype, resolution, dynamicrange);
        this.framerate = framerate
        this.workflowSolution = workflowSolution
    }

    accept(visitor) {
        visitor.visit_highspeed(this);
    }
}


// Pretty Printer Visitor
class PrettyPrintingVisitor extends Visitor {
    constructor(arr) {
        super();
        this.arr = arr
        this.depth = 0;
        this.index = 0;
        this.stringbefore = `Total before discount:`
        this.stringafter = `Total after discount:`
        this.stringdiscount = `Total discount amount:`
    }

    print(v) {
        console.log(`${"                             ".slice(0, this.depth * 4)}${v}`);
    }

    print_indent(v) {
        this.depth += 1;
        this.print(v);
        this.depth -= 1;
    }

    print_indentSub(v) {
        this.depth += 2;
        this.print(v);
        this.depth -= 2;
    }

    handle_spacing(s) {
        let output;
        let stringbeforelen = this.stringbefore.length
        let space = "        "
        let extraspace = " "

        if (s === this.stringbefore) {
            output = this.stringbefore + space
        } else if (s === this.stringdiscount) {
            output = this.stringdiscount + space
        }
        else {
            let extraspaces = space
            let extra = stringbeforelen - this.stringafter.length
            for (let i = 0; i < extra; i++) {
                extraspaces = space + extraspace
            }
            output = this.stringafter + extraspaces
        }
        return output
    }

    visit_camera(o) {
        this.print_indent(`Camera - `);
        this.print_indentSub(`Model: ${o.brand}`);
        this.print_indentSub(`Sensor: ${o.sensortype}`);
        this.print_indentSub(`Resolution: ${o.resolution}`);
        this.print_indentSub(`Dynamic Range: ${o.dynamicrange}`);
        this.print_indentSub(`Rental Price: R${o.price}`);
    }

    visit_lenses(o) {
        this.print_indent(`Lense -`);
        this.print_indentSub(`Model: ${o.brand}`);
        this.print_indentSub(`Type: ${o.lensetype}`);
        this.print_indentSub(`Rental Price: R${o.price}`);
    }

    visit_highspeed(o) {
        this.print_indent(`High Speed Camera -`);
        this.print_indentSub(`Model: ${o.brand}`);
        this.print_indentSub(`Resolution: ${o.resolution}`);
        this.print_indentSub(`Dynamic Range: ${o.dynamicrange}`);
        this.print_indentSub(`FPS: ${o.framerate}`);
        this.print_indentSub(`Workflow Solution: ${o.workflowSolution}`);
        this.print_indentSub(`Rental Price: R${o.price}`);
        console.log('\n')
    }

    enter_collection(o) {
        console.log('\n')
        this.print('(Entering collection)')
        console.log('\n')
    }

    exit_collection(o) {
        console.log('\n')
        this.print('(Exiting collection)')
    }

    enter_kit(o) {
        console.log('\n')
        this.depth += 1;
        this.print('(Entering kit)')
        this.print(o.name + ":")
        console.log('\n')
    }

    exit_kit(o) {
        this.print_indentSub(`${this.handle_spacing(this.stringbefore)} R${this.arr[this.index].totalBefore}`);
        this.print_indentSub(`${this.handle_spacing(this.stringafter)} R${this.arr[this.index].totalAfter}`);
        this.print_indentSub(`${this.handle_spacing(this.stringdiscount)} R${this.arr[this.index].totalBefore - this.arr[this.index].totalAfter}`);
        this.print('(Exiting kit)')
        this.depth -= 1;
        this.index = this.index + 1
    }
}




// instantiate composites and classes used in it

// create two individual gear items in GearCollection, a camera and a lense
// create two kits, a budget and a pro kit, each containing gear items
// note that, even though in practise all gear items will be listed in GearCollection
// that it is not necessary for Kit to work. Kit can contain gear items outside of that 
// in GearCollection, thus it is an independent class from GearCollection

let list = new GearCollection(
    new Camera("Arri Alexa Mini", 18500.00, "Full-frame", "2K", "10-bit"),
    new Lense("Zeiss CP.3 Kit", 7500.00, "Prime"),
    new Kit(
        "Budget Kit",
        new Camera("Arri Alexa Mini", 18500.00, "Full-frame", "2K", "10-bit"),
        new Lense("Zeiss CP.3 Kit", 7500.00, "Prime"),
        new HighSpeedCamera("Phantom 8K Flex", 48500.00, "Full-frame", "8K Ultra HD", "12-bit", "4000fps", "Phantom CineStation 4")),
    new Kit(
        "Pro Kit",
        new Camera("Epic Red Dragon", 24000.00, "Full-frame", "6K", "16-bit"),
        new Lense("Cook Anamorphic Primes Kit", 14000.00, "Prime"),
        new Lense("24-290mm Angenieux Optimo T2.8", 5000.00, "Zoom"),
        new HighSpeedCamera("Phantom 4K Flex", 30000, "Full-frame", "4K Ultra HD", "12-bit", "10000fps", "Phantom CineStation 4"),
    ),
)

// calls a specified discount to be applied to kits and shows result in console
function showDiscount(discount) {
    let kitvisit = new KitDiscountVisitor(discount)
    list.accept(kitvisit)
    let arr = kitvisit.getTotals();
    list.accept(new PrettyPrintingVisitor(arr))
}

// calls a specified adjustment to gear prices to be applied to all gear items, calls specified discount to kits and shows result in console
function showAdjust(discount, priceAdjust, operator) {
    list.accept(new AdjustPriceVisitor(priceAdjust, operator))
    let kitvisit = new KitDiscountVisitor(discount)
    list.accept(kitvisit)
    let arr = kitvisit.getTotals();
    list.accept(new PrettyPrintingVisitor(arr))
}

// showDiscount(0.05);
showAdjust(0.05, 0.12, "+");