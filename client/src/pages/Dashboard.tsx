import React, { useState, useEffect} from "react";
import classNames from "classnames";
import { useSelector } from "react-redux";

// Components
import Navbar from "../components/Navbar";
import DefaultButton from "../components/buttons/DefaultButton";
import DefaultModal from "../components/modals/DefaultModal";
import DefaultPills from "../components/pills/DefaultPills";

// Api
import { getSearchHistory, search } from '../api/searchs';

const Dashboard = () => {
  const [searchHistory, setSearchHistory] = useState([]);
  const [showNewSearchModal, setShowNewSearchModal] = useState(false);
  
  const preferedTheme = useSelector((state) => state.user.preferedTheme);

  const wrapperClasses = classNames('h-screen', 'flex', 'flex-col', 'transition', 'transition-all', 'duration-500', 'ease-in-out', {
    'bg-darkBlack': preferedTheme === 'dark',
    'bg-lightWhite': preferedTheme === 'light',
  });

  const translateStatus = (originStatus) => {
    if (originStatus === 'completed' || originStatus === 'over') {
      return 'success'
    }

    if (originStatus === 'pending') {
      return 'warning'
    }

    if (originStatus === 'failed') {
      return 'error'
    }
  }
  
  const initSearch = (searchData) => {
    console.log(searchData);
    const token = localStorage.getItem('access');
    search(searchData, token)
      .then((response) => {
        console.log(response)
      })
      .catch((error) => {
        console.error(error);
      });
  };
  
  useEffect(() => {
    const token = localStorage.getItem('access');
    getSearchHistory(token)
      .then((response) => {
        console.log(response)
        setSearchHistory(response);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [])
  
  return (
    <div className={wrapperClasses}>
      <Navbar />
      <div className={classNames(
        'flex', 'flex-col', 'my-2', 'mx-10', 'rounded', 'shadow', 'relative', 'h-full',
        preferedTheme === 'dark' ? 'bg-lighterDark' : 'bg-darkerWhite',
      )}>
        {
          showNewSearchModal && <DefaultModal onClose={() => setShowNewSearchModal(false)} onAction={(searchData) => initSearch(searchData)} />
        }
        <div className={classNames('px-4', 'py-2')}>
          <h1 className={classNames(
            'font-bold',
            preferedTheme === 'dark' ? 'text-lightWhite' : 'text-darkBlack',
          )}>Dashboard</h1>
          <div className="flex justify-end">
            <DefaultButton text="New search" onClick={() => setShowNewSearchModal(true)} />
          </div>
          <div className="flex flex-col gap-4">
            <span className={classNames(
              'text-lg font-semibold',
              preferedTheme === 'dark' ? 'text-darkerWhite' : 'text-darkerDark')}
            >
              History {`(${searchHistory.length})`}
            </span>
            <div className={classNames(
              'flex flex-col gap-4 p-2',
              preferedTheme === 'dark' ? 'bg-darkBlack' : 'bg-lightWhite',
            )}>
              {
                searchHistory.map((search, index) => {
                  return (
                    <div key={search._id} className={classNames(
                      'flex flex-col px-2 py-1 rounded shadow',
                      preferedTheme === 'dark' ? 'bg-lighterDark' : 'bg-darkerWhite',
                    )}>
                      <div className="flex justify-between px-2 py-0.5 bg-darkerWhite rounded">
                        <span>{search._id}</span>
                        <span>{search.createdAt}</span>
                      </div>
                      <div className="p-1">Product preview will go here</div>
                      <div className="flex justify-between ">
                        <DefaultPills label={search.status} status={translateStatus(search.status)} />
                        <span>{search.updatedAt}</span>
                      </div>
                    </div>
                  );
                })
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;