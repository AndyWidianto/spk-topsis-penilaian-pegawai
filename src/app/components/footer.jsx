
export default function Footer() {

    return (
        <footer className="bg-gray-900 text-center py-4 border-t">
            <p className="text-sm text-gray-200">
                © 2026 Employee Evaluation System (TOPSIS)
            </p>
            <p className="text-sm text-gray-200">
                Built by {" "}
                <a
                    href="https://github.com/AndyWidianto/spk-topsis-penilaian-pegawai"
                    className="text-blue-500 hover:underline"
                >
                    Andy Widianto
                </a>
            </p>
        </footer>

    );
}