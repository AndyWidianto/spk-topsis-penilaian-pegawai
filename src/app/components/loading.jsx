
export default function Loading({ size }) {
    
    return (
        <>
        <div className="flex items-center w-full justify-center">
            <div className={`rounded-full relative border`}>
                <div className="rounded-full absolute border-8 border-gray-300" style={{ height: `${size ?? 50}px`, width: `${size ?? 50}px`}}></div>
                <div className="rounded-full absolute border-8 border-blue-500 border-b-transparent animate-circle" style={{ height: `${size ?? 50}px`, width: `${size ?? 50}px`}}></div>
            </div>
        </div>
        </>
    );
}