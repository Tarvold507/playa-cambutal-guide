
import AdventureBusinessSubmissionForm from '../AdventureBusinessSubmissionForm';

const DoBusinessSubmission = () => {
  return (
    <section className="bg-white py-16">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Share Your Business</h2>
        <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
          Are you offering fun activities in Cambutal? Join our directory and connect with 
          visitors looking for authentic local experiences. Whether you offer surf lessons, 
          nature tours, fishing charters, art or fitness classes, showcase your business to our community.
        </p>
        <AdventureBusinessSubmissionForm />
      </div>
    </section>
  );
};

export default DoBusinessSubmission;
