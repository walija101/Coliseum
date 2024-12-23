function ProfilePreferences() {
    return (
        <div className="flex flex-col justify-center items-center font-playfair my-4">
            <p className="text-center font-bold text-2xl m-4">Your Preferences</p>
            <div className="bg-gold flex flex-col justify-center w-full max-w-sm rounded-lg p-4 text-center"> 
                <div>
                    <form className="space-y-4 text-black">
                        <div className="space-y-2">
                            <label htmlFor="ageRange" className="block text-fontBrown font-semibold uppercase text-xl ">
                                AGE RANGE
                            </label>
                            <input
                                type="text"
                                id="ageRange"
                                className="w-full p-2 rounded border font-sans border-gray-300 text-md focus:outline-none"
                            />
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="gender" className="block text-fontBrown font-semibold uppercase text-xl ">
                                GENDER
                            </label>
                            <input
                                type="text"
                                id="gender"
                                className="w-full p-2 rounded border font-sans border-gray-300 text-md focus:outline-none"
                            />
                        </div>
                        <div className="space-y-2">
                            <label htmlFor="ethnicity" className="block text-fontBrown font-semibold uppercase text-xl ">
                                ETHNICITY
                            </label>
                            <input
                                type="text"
                                id="ethnicity"
                                className="w-full p-2 rounded border font-sans border-gray-300 text-md focus:outline-none"
                            />
                        </div>
                        <div className="space-y-2">
                            <label htmlFor="location" className="block text-fontBrown font-semibold uppercase text-xl ">
                                LOCATION
                            </label>
                            <input
                                type="text"
                                id="location"
                                className="w-full p-2 rounded border font-sans border-gray-300 text-md focus:outline-none"
                            />
                        </div>
                        <div className="space-y-2">
                            <label htmlFor="height" className="block text-fontBrown font-semibold uppercase text-xl">
                                HEIGHT
                            </label>
                            <input
                                type="password"
                                id="height"
                                className="w-full p-2 rounded border font-sans border-gray-300 focus:outline-none"
                            />
                        </div>
                        <div className="space-y-2">
                            <label htmlFor="occupation" className="block text-fontBrown font-semibold uppercase text-xl">
                                OCCUPATION
                            </label>
                            <input
                                type="password"
                                id="occupation"
                                className="w-full p-2 rounded border font-sans border-gray-300 focus:outline-none"
                            />
                        </div>
                    </form>
                </div>
                <button
                    type="submit"
                    className="w-full bg-specialGreen active:bg-[#68855A] font-playfair text-black uppercase py-2 mt-4 rounded transition-colors"
                    >
                    Update Preferences
                </button>
            </div>
        </div>
    );
}

export default ProfilePreferences;