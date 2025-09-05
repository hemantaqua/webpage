import ContactForm from '@/components/ContactForm';

export default function ContactPage() {
    return (
        <div className="container mx-auto px-6 py-16">
            <h1 className="text-4xl font-bold text-center mb-8">Contact Us</h1>
            <div className="grid md:grid-cols-2 gap-12">
                <div>
                    <h2 className="text-2xl font-semibold mb-4">Get in Touch</h2>
                    <p className="text-gray-700 mb-6">
                        We would love to hear from you. Fill out the form or use the contact details below.
                    </p>
                    <div className="space-y-4">
                        <p><strong>Email:</strong> contact@yourcompany.com</p>
                        <p><strong>Phone:</strong> +91 12345 67890</p>
                        <p><strong>Address:</strong> 123 Business Rd, Hyderabad, Telangana, India</p>
                    </div>
                    <div className="flex space-x-4 mt-8">
                        <a href="mailto:contact@yourcompany.com" className="bg-secondary text-white px-6 py-3 rounded-md hover:bg-blue-700">Email Us</a>
                        <a href="https://wa.me/911234567890" target="_blank" rel="noopener noreferrer" className="bg-primary text-white px-6 py-3 rounded-md hover:bg-green-700">WhatsApp Us</a>
                    </div>
                </div>
                <div>
                    <ContactForm />
                </div>
            </div>
        </div>
    );
}