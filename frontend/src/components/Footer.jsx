import { Footer as FlowbiteFooter } from "flowbite-react";
import { Link } from "react-router-dom";
import logo from "../image/logo.png";

export default function FooterCom() {
  return (
    <FlowbiteFooter container className="border border-t-8 bg-gray-900">
      <div className="w-full max-w-7xl mx-auto">
        <div className="grid w-full justify-between ">
          <div className="mt-5">
            <Link to="/" className="self-center whitespace-nowrap text-sm sm:text-xl font-semibold">
              <img src={logo} alt="logo" className="h-20" />
            </Link>
          </div>
          <div className="grid grid-cols-4 mt-4 sm:grid-cols-4 sm:gap-6">
            <div>
              <FlowbiteFooter.Title title="About" />
            </div>
            <div>
              <FlowbiteFooter.Title title="Packages" />
            </div>
            <div>
              <FlowbiteFooter.Title title="Contact" />
            </div>
            <div>
              <FlowbiteFooter.Title title="Privacy Policy" />
            </div>
          </div>
        </div>
        <FlowbiteFooter.Divider />
        <div>
          <FlowbiteFooter.Copyright
            href="#"
            by="ShanConstructions. All rights reserved"
            year={new Date().getFullYear()}
          />
        </div>
      </div>
    </FlowbiteFooter>
  );
}
