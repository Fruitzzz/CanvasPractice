let shapes = [];
shapes.push({
    name: "polygon",
    right: 150,
    left: 50,
    top: 210,
    bottom: 290,
    startPoint: {
        x: 100,
        y: 210
    },
    points: [
        {
            x: 50,
            y: 250
        },
        {
            x: 75,
            y: 290
        },
        {
            x: 125,
            y: 290
        },
        {
            x: 150,
            y: 250
        }
   ]
});
shapes.push({
    name: "romb",
    right: 90,
    left: 10,
    top: 0,
    bottom: 200,
    startPoint: {
        x: 50,
        y: 0
    },
    points: [
        {
            x: 10,
            y: 100
        },
        {
            x: 50,
            y: 200
        },
        {
            x: 90,
            y: 100
        },
   ]
});
export {shapes}