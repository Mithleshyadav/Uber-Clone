import React from 'react';

const vehicles = [
  {
    id: 'car',
    name: 'UberGo',
    seats: 4,
    eta: '2 mins',
    desc: 'Affordable, compact rides',
    image: 'https://swyft.pl/wp-content/uploads/2023/05/how-many-people-can-a-uberx-take.jpg',
  },
  {
    id: 'moto',
    name: 'Moto',
    seats: 1,
    eta: '3 mins',
    desc: 'Affordable motorcycle rides',
    image: 'https://www.uber-assets.com/image/upload/f_auto,q_auto:eco,c_fill,h_638,w_956/v1649231091/assets/2c/7fa194-c954-49b2-9c6d-a3b8601370f5/original/Uber_Moto_Orange_312x208_pixels_Mobile.png',
  },
  {
    id: 'auto',
    name: 'UberAuto',
    seats: 3,
    eta: '3 mins',
    desc: 'Affordable Auto rides',
    image: 'https://www.uber-assets.com/image/upload/f_auto,q_auto:eco,c_fill,h_368,w_552/v1648431773/assets/1d/db8c56-0204-4ce4-81ce-56a11a07fe98/original/Uber_Auto_558x372_pixels_Desktop.png',
  },
];

const VehiclePanel = ({ setVehiclePanel, setConfirmRidePanel, selectVehicle, fare }) => {
  return (
    <div>
      <h5 className="p-1 text-center w-[93%] absolute top-0" onClick={() => setVehiclePanel(false)}>
        <i className="text-3xl text-gray-200 ri-arrow-down-wide-line"></i>
      </h5>
      <h3 className="text-2xl font-semibold mb-5">Choose a Vehicle</h3>
      {vehicles.map((v) => (
        <div
          key={v.id}
          onClick={() => {
            setConfirmRidePanel(true);
            selectVehicle(v.id);
          }}
          className="flex border-2 active:border-black mb-2 rounded-xl w-full p-3 items-center justify-between"
        >
          <img className="h-10" src={v.image} alt={v.name} />
          <div className="ml-2 w-1/2">
            <h4 className="font-medium text-base">
              {v.name} <span><i className="ri-user-3-fill"></i>{v.seats}</span>
            </h4>
            <h5 className="font-medium text-sm">{v.eta} away</h5>
            <p className="font-normal text-xs text-gray-600">{v.desc}</p>
          </div>
          <h2 className="text-lg font-semibold">₹{fare[v.id]}</h2>
        </div>
      ))}
    </div>
  );
};

export default VehiclePanel;
